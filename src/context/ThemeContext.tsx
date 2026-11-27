import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Platform, useColorScheme } from "react-native";

type ThemeMode = "system" | "light" | "dark";

type ThemeColors = {
  background: string;
  card: string;
  cardSecondary: string;
  text: string;
  secondaryText: string;
  accent: string;
  icon: string;
  border: string;
  glass: string;
};

type ThemeContextType = {
  darkTheme: boolean;
  automaticTheme: boolean;
  setAutomaticTheme: (value: boolean) => void;
  setDarkTheme: (value: boolean) => void;
  colors: ThemeColors;
  themeLoading: boolean;
};

const lightColors: ThemeColors = {
  background: "#F4D5D5",
  card: "#FFF7F6",
  cardSecondary: "rgba(255,255,255,0.4)",
  text: "#1D1D1D",
  secondaryText: "#8D7777",
  accent: "#D9655C",
  icon: "#803F3B",
  border: "rgba(255,255,255,0.65)",
  glass: "rgba(255,247,246,0.78)",
};

const darkColors: ThemeColors = {
  background: "#211C22",
  card: "#342B34",
  cardSecondary: "rgba(255,255,255,0.07)",
  text: "#FFF0F2",
  secondaryText: "#C6AEB8",
  accent: "#E47A85",
  icon: "#F0B6BF",
  border: "rgba(255,255,255,0.12)",
  glass: "rgba(52,43,52,0.88)",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = "habitify_theme_mode";
const OLD_THEME_KEY = "habitify_dark_theme";

async function readTheme(): Promise<ThemeMode> {
  try {
    const value =
      Platform.OS === "web"
        ? localStorage.getItem(THEME_KEY)
        : await SecureStore.getItemAsync(THEME_KEY);

    if (value === "system" || value === "light" || value === "dark") {
      return value;
    }

    // Переносим старую настройку пользователя
    const oldValue =
      Platform.OS === "web"
        ? localStorage.getItem(OLD_THEME_KEY)
        : await SecureStore.getItemAsync(OLD_THEME_KEY);

    if (oldValue === "true") return "dark";
    if (oldValue === "false") return "light";

    return "system";
  } catch (error) {
    console.error("Не удалось загрузить тему:", error);
    return "system";
  }
}

async function saveTheme(value: ThemeMode): Promise<void> {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(THEME_KEY, value);
    } else {
      await SecureStore.setItemAsync(THEME_KEY, value);
    }
  } catch (error) {
    console.error("Не удалось сохранить тему:", error);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();

  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [themeLoading, setThemeLoading] = useState(true);

  useEffect(() => {
    let active = true;

    readTheme().then((savedTheme) => {
      if (active) {
        setThemeMode(savedTheme);
        setThemeLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!themeLoading) {
      saveTheme(themeMode);
    }
  }, [themeMode, themeLoading]);

  const setAutomaticTheme = useCallback(
    (value: boolean) => {
      console.log("Автоматическая тема нажата:", value);

      if (value) {
        setThemeMode("system");
      } else {
        setThemeMode(colorScheme === "dark" ? "dark" : "light");
      }
    },
    [colorScheme],
  );

  const setDarkTheme = useCallback((value: boolean) => {
    setThemeMode(value ? "dark" : "light");
  }, []);

  const automaticTheme = themeMode === "system";

  const darkTheme = automaticTheme
    ? colorScheme === "dark"
    : themeMode === "dark";

  const colors = darkTheme ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        darkTheme,
        automaticTheme,
        setAutomaticTheme,
        setDarkTheme,
        colors,
        themeLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme должен использоваться внутри ThemeProvider");
  }

  return context;
}
