import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useSQLiteContext } from "expo-sqlite";

import categories from "../../constants/categories";
import type { Frequency, Habit } from "../../types/habit";
import { useAuth } from "./AuthContext";

type HabitInput = {
  name: string;
  description: string;
  category: string;
  createdAt: string;
  frequency: Frequency;

  selectedDays?: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
};

type HabitsContextType = {
  habits: Habit[];
  loading: boolean;

  loadHabits: () => Promise<void>;
  addHabit: (data: HabitInput) => Promise<void>;
  updateHabit: (id: number, data: HabitInput) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
  toggleHabit: (id: number, date: string) => Promise<void>;
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

type HabitsProviderProps = {
  children: ReactNode;
};

export function HabitsProvider({ children }: HabitsProviderProps) {
  const db = useSQLiteContext();
  const { user, loading: authLoading } = useAuth();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const ensureHabitColumns = async () => {
    const columns = await db.getAllAsync<{ name: string }>(
      "PRAGMA table_info(habits)",
    );

    const existingColumns = columns.map((column) => column.name);

    if (!existingColumns.includes("selected_days")) {
      await db.execAsync("ALTER TABLE habits ADD COLUMN selected_days TEXT");
    }

    if (!existingColumns.includes("day_of_month")) {
      await db.execAsync("ALTER TABLE habits ADD COLUMN day_of_month INTEGER");
    }

    if (!existingColumns.includes("month_of_year")) {
      await db.execAsync("ALTER TABLE habits ADD COLUMN month_of_year INTEGER");
    }
  };

  const ensureCategories = async () => {
    for (const category of categories) {
      await db.runAsync(
        `INSERT INTO categories (name, description)
         SELECT ?, ?
         WHERE NOT EXISTS (
           SELECT 1 FROM categories WHERE name = ?
         )`,
        category.label,
        "",
        category.label,
      );
    }
  };

  const getCategoryId = async (categoryValue: string) => {
    const selectedCategory = categories.find(
      (item) => item.value === categoryValue,
    );

    if (!selectedCategory) {
      throw new Error("Категория не найдена");
    }

    await ensureCategories();

    const result = await db.getFirstAsync<{ id: number }>(
      "SELECT id FROM categories WHERE name = ?",
      selectedCategory.label,
    );

    if (!result) {
      throw new Error("Категория отсутствует в базе данных");
    }

    return result.id;
  };

  const getCreatedDate = (createdAt: string) => {
    return new Date(`${createdAt.slice(0, 10)}T00:00:00`);
  };

  const loadHabits = useCallback(async () => {
    if (!user) {
      setHabits([]);
      return;
    }

    try {
      await ensureHabitColumns();

      const rows = await db.getAllAsync<{
        id: number;
        habit_name: string;
        description: string | null;
        created_at: string;
        category_name: string;
        frequency_type: string;
        selected_days: string | null;
        day_of_month: number | null;
        month_of_year: number | null;
      }>(
        `SELECT
          h.id,
          h.habit_name,
          h.description,
          h.created_at,
          c.name AS category_name,
          h.frequency_type,
          h.selected_days,
          h.day_of_month,
          h.month_of_year
        FROM habits h
        JOIN categories c
          ON h.category_id = c.id
        WHERE h.user_id = ?
        ORDER BY h.id DESC`,
        user.id,
      );

      const markers = await db.getAllAsync<{
        habit_id: number;
        marked_at: string;
      }>("SELECT habit_id, marked_at FROM markers WHERE user_id = ?", user.id);

      const loadedHabits: Habit[] = rows.map((row) => {
        const completedDates = markers
          .filter((marker) => marker.habit_id === row.id)
          .map((marker) => marker.marked_at.slice(0, 10));

        const categoryValue =
          categories.find((item) => item.label === row.category_name)?.value ??
          "other";

        const createdAt = row.created_at.slice(0, 10);
        const createdDate = getCreatedDate(createdAt);

        let selectedDays: number[];

        try {
          selectedDays = row.selected_days
            ? JSON.parse(row.selected_days)
            : [createdDate.getDay()];
        } catch {
          selectedDays = [createdDate.getDay()];
        }

        return {
          id: row.id,
          name: row.habit_name,
          description: row.description ?? "",
          category: categoryValue,
          createdAt,
          completedDates,
          frequency: row.frequency_type as Frequency,

          selectedDays,
          dayOfMonth: row.day_of_month ?? createdDate.getDate(),
          monthOfYear: row.month_of_year ?? createdDate.getMonth() + 1,
        };
      });
      console.log(
        "Загруженные привычки:",
        JSON.stringify(loadedHabits, null, 2),
      );
      setHabits(loadedHabits);
    } catch (error) {
      console.error("Ошибка загрузки привычек:", error);
      throw error;
    }
  }, [db, user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const initialize = async () => {
      try {
        await ensureHabitColumns();
        await ensureCategories();

        console.log("SQLite: структура БД проверена");

        await loadHabits();
      } catch (error) {
        console.error("Ошибка инициализации контекста:", error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [loadHabits, authLoading, user]);

  const addHabit = async (data: HabitInput) => {
    if (!user) {
      throw new Error("Пользователь не авторизован");
    }
    try {
      await ensureHabitColumns();

      const categoryId = await getCategoryId(data.category);

      const createdDate = getCreatedDate(data.createdAt);

      const selectedDays = data.selectedDays ?? [createdDate.getDay()];

      const dayOfMonth = data.dayOfMonth ?? createdDate.getDate();

      const monthOfYear = data.monthOfYear ?? createdDate.getMonth() + 1;

      await db.runAsync(
        `INSERT INTO habits (
          user_id,
          habit_name,
          description,
          created_at,
          category_id,
          frequency_type,
          selected_days,
          day_of_month,
          month_of_year
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        user.id,
        data.name.trim(),
        data.description.trim(),
        data.createdAt,
        categoryId,
        data.frequency,
        JSON.stringify(selectedDays),
        dayOfMonth,
        monthOfYear,
      );

      await loadHabits();
    } catch (error) {
      console.error("Ошибка добавления привычки:", error);
      throw error;
    }
  };

  const updateHabit = async (id: number, data: HabitInput) => {
    if (!user) {
      throw new Error("Пользователь не авторизован");
    }
    try {
      await ensureHabitColumns();

      const categoryId = await getCategoryId(data.category);
      const createdDate = getCreatedDate(data.createdAt);

      const selectedDays = data.selectedDays ?? [createdDate.getDay()];

      const dayOfMonth = data.dayOfMonth ?? createdDate.getDate();

      const monthOfYear = data.monthOfYear ?? createdDate.getMonth() + 1;

      await db.runAsync(
        `UPDATE habits
         SET habit_name = ?,
             description = ?,
             category_id = ?,
             frequency_type = ?,
             selected_days = ?,
             day_of_month = ?,
             month_of_year = ?
         WHERE id = ? AND user_id = ?`,
        data.name.trim(),
        data.description.trim(),
        categoryId,
        data.frequency,
        JSON.stringify(selectedDays),
        dayOfMonth,
        monthOfYear,
        id,
        user.id,
      );

      await loadHabits();
    } catch (error) {
      console.error("Ошибка редактирования привычки:", error);
      throw error;
    }
  };

  const deleteHabit = async (id: number) => {
    if (!user) {
      throw new Error("Пользователь не авторизован");
    }
    try {
      await db.runAsync(
        "DELETE FROM habits WHERE id = ? AND user_id = ?",
        id,
        user.id,
      );

      await loadHabits();
    } catch (error) {
      console.error("Ошибка удаления привычки:", error);
      throw error;
    }
  };

  const toggleHabit = async (id: number, date: string) => {
    if (!user) {
      throw new Error("Пользователь не авторизован");
    }
    try {
      const existingMarker = await db.getFirstAsync<{
        habit_id: number;
      }>(
        `SELECT habit_id
         FROM markers
         WHERE habit_id = ?
           AND user_id = ?
           AND marked_at = ?`,
        id,
        user.id,
        date,
      );

      if (existingMarker) {
        await db.runAsync(
          `DELETE FROM markers
           WHERE habit_id = ?
             AND user_id = ?
             AND marked_at = ?`,
          id,
          user.id,
          date,
        );
      } else {
        await db.runAsync(
          `INSERT INTO markers (
            user_id,
            habit_id,
            marked_at
          ) VALUES (?, ?, ?)`,
          user.id,
          id,
          date,
        );
      }

      await loadHabits();
    } catch (error) {
      console.error("Ошибка изменения отметки:", error);
      throw error;
    }
  };

  return (
    <HabitsContext.Provider
      value={{
        habits,
        loading,
        loadHabits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabit,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);

  if (!context) {
    throw new Error("useHabits must be used inside HabitsProvider");
  }

  return context;
}
