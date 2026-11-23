import { pbkdf2Async } from "@noble/hashes/pbkdf2.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { useSQLiteContext } from "expo-sqlite";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { Platform } from "react-native";

export type User = {
  id: number;
  surname: string;
  name: string;
  age: number;
  login: string;
};

type RegisterData = {
  surname: string;
  name: string;
  age: number;
  login: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (data: RegisterData) => Promise<void>;
  loginUser: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "habitify_user_id";

const PBKDF2_ITERATIONS = 100000;

async function hashPassword(password: string): Promise<string> {
  const salt = Crypto.getRandomBytes(16);

  const hash = await pbkdf2Async(sha256, utf8ToBytes(password), salt, {
    c: PBKDF2_ITERATIONS,
    dkLen: 32,
    asyncTick: 100,
  });

  return `pbkdf2-sha256$${PBKDF2_ITERATIONS}$${bytesToHex(salt)}$${bytesToHex(hash)}`;
}

async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const parts = storedHash.split("$");

  if (parts.length !== 4 || parts[0] !== "pbkdf2-sha256") {
    return false;
  }

  const iterations = Number(parts[1]);

  if (!Number.isInteger(iterations) || iterations < 1 || iterations > 1000000) {
    return false;
  }

  try {
    const salt = hexToBytes(parts[2]);
    const expectedHash = hexToBytes(parts[3]);

    const actualHash = await pbkdf2Async(sha256, utf8ToBytes(password), salt, {
      c: iterations,
      dkLen: expectedHash.length,
      asyncTick: 100,
    });

    if (actualHash.length !== expectedHash.length) {
      return false;
    }

    let difference = 0;

    for (let i = 0; i < actualHash.length; i++) {
      difference |= actualHash[i] ^ expectedHash[i];
    }

    return difference === 0;
  } catch {
    return false;
  }
}

async function saveSession(userId: number) {
  const value = String(userId);

  if (Platform.OS === "web") {
    localStorage.setItem(SESSION_KEY, value);
  } else {
    await SecureStore.setItemAsync(SESSION_KEY, value);
  }
}

async function getSession() {
  if (Platform.OS === "web") {
    return localStorage.getItem(SESSION_KEY);
  }

  return await SecureStore.getItemAsync(SESSION_KEY);
}

async function removeSession() {
  if (Platform.OS === "web") {
    localStorage.removeItem(SESSION_KEY);
  } else {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserById = useCallback(
    async (id: number) => {
      return await db.getFirstAsync<User>(
        `SELECT id, surname, name, age, login
         FROM users
         WHERE id = ?`,
        id,
      );
    },
    [db],
  );

  // Восстанавливаем авторизацию при запуске
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedId = await getSession();

        if (savedId) {
          const savedUser = await getUserById(Number(savedId));

          if (savedUser) {
            setUser(savedUser);
          } else {
            await removeSession();
          }
        }
      } catch (error) {
        console.error("Ошибка восстановления авторизации:", error);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [getUserById]);

  // Регистрация
  const register = async (data: RegisterData) => {
    const surname = data.surname.trim();
    const name = data.name.trim();
    const loginValue = data.login.trim();

    if (!surname || !name || !loginValue || !data.password) {
      throw new Error("Заполни все поля");
    }

    if (!Number.isInteger(data.age) || data.age < 1 || data.age > 120) {
      throw new Error("Укажи корректный возраст");
    }

    if (data.password.length < 8) {
      throw new Error("Пароль должен содержать минимум 8 символов");
    }

    const existingUser = await db.getFirstAsync<{ id: number }>(
      "SELECT id FROM users WHERE login = ?",
      loginValue,
    );

    if (existingUser) {
      throw new Error("Этот логин уже занят");
    }

    const passwordHash = await hashPassword(data.password);

    // Сохраняем старые тестовые привычки за первым аккаунтом
    const localUser = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM users
       WHERE id = 1
         AND login IS NULL
         AND password_hash IS NULL`,
    );

    let userId: number;

    if (localUser) {
      await db.runAsync(
        `UPDATE users
         SET surname = ?, name = ?, age = ?,
             login = ?, password_hash = ?
         WHERE id = ?`,
        surname,
        name,
        data.age,
        loginValue,
        passwordHash,
        localUser.id,
      );

      userId = localUser.id;
    } else {
      const result = await db.runAsync(
        `INSERT INTO users (
          surname, name, age, login, password_hash
        ) VALUES (?, ?, ?, ?, ?)`,
        surname,
        name,
        data.age,
        loginValue,
        passwordHash,
      );

      userId = result.lastInsertRowId;
    }

    const newUser = await getUserById(userId);

    if (!newUser) {
      throw new Error("Не удалось создать пользователя");
    }

    await saveSession(userId);
    setUser(newUser);
  };

  // Вход
  const loginUser = async (loginValue: string, password: string) => {
    const totalStart = Date.now();

    // 1. Поиск пользователя в SQLite
    const dbStart = Date.now();

    const foundUser = await db.getFirstAsync<User & { password_hash: string }>(
      `SELECT id, surname, name, age, login, password_hash
     FROM users
     WHERE login = ?`,
      loginValue.trim(),
    );

    console.log("1. Поиск пользователя:", Date.now() - dbStart, "мс");

    if (!foundUser) {
      throw new Error("Пользователь не найден. Зарегистрируйтесь.");
    }

    // 2. Проверка пароля
    const hashStart = Date.now();

    const passwordCorrect = await verifyPassword(
      password,
      foundUser.password_hash,
    );

    console.log("2. Проверка пароля:", Date.now() - hashStart, "мс");

    if (!passwordCorrect) {
      throw new Error("Неверный логин или пароль");
    }

    // 3. Создание объекта пользователя
    const currentUser: User = {
      id: foundUser.id,
      surname: foundUser.surname,
      name: foundUser.name,
      age: foundUser.age,
      login: foundUser.login,
    };

    // 4. Сохранение сессии
    const sessionStart = Date.now();

    await saveSession(currentUser.id);

    console.log("3. Сохранение сессии:", Date.now() - sessionStart, "мс");

    setUser(currentUser);

    console.log("4. Общее время входа:", Date.now() - totalStart, "мс");
  };

  // Выход
  const logout = async () => {
    await removeSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
