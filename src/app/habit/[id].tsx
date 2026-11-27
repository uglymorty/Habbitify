import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AdaptiveGlassView from "../../../components/AdaptiveLiquidGlassView";
import categories from "../../../constants/categories";
import type { Habit } from "../../../types/habit";
import { useHabits } from "../../context/HabitsContext";
import { useTheme } from "../../context/ThemeContext";

const frequencyNames: Record<string, string> = {
  daily: "Каждый день",
  weekly: "Еженедельно",
  monthly: "Ежемесячно",
  yearly: "Ежегодно",
};

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isHabitScheduled = (habit: Habit, date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const weekDay = date.getDay();

  switch (habit.frequency) {
    case "daily":
      return true;

    case "weekly":
      return habit.selectedDays?.includes(weekDay) ?? false;

    case "monthly": {
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
      ).getDate();

      return day === Math.min(habit.dayOfMonth ?? 1, lastDay);
    }

    case "yearly":
      return day === habit.dayOfMonth && month === habit.monthOfYear;

    default:
      return false;
  }
};

export default function HabitDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits } = useHabits();
  const { colors, darkTheme } = useTheme();
  const habit = habits.find((item) => String(item.id) === id);

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text>Привычка не найдена</Text>
        <Pressable onPress={() => router.back()}>
          <Text>Вернуться назад</Text>
        </Pressable>
      </View>
    );
  }

  const categoryName =
    categories.find((item) => item.value === habit.category)?.label ??
    habit.category;

  const today = new Date();
  const todayKey = getDateKey(today);

  // Формируем историю за последние 30 дней
  const history = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - index,
    );

    const dateKey = getDateKey(date);

    return {
      date,
      dateKey,
      scheduled: isHabitScheduled(habit, date),
      completed: habit.completedDates.includes(dateKey),
    };
  }).filter(
    (item) =>
      item.dateKey >= habit.createdAt &&
      item.dateKey <= todayKey &&
      item.scheduled,
  );

  const completedCount = history.filter((item) => item.completed).length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Кнопка назад */}
      <AdaptiveGlassView
        glassEffectStyle="regular"
        isInteractive
        style={styles.backGlass}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />

          <Text style={[styles.backText, { color: colors.text }]}>Назад</Text>
        </Pressable>
      </AdaptiveGlassView>

      {/* Название */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{habit.name}</Text>
        <Text style={[styles.category, { color: colors.secondaryText }]}>
          {categoryName}
        </Text>
      </View>

      {/* Описание */}
      <View
        style={[
          styles.section,
          {
            backgroundColor: darkTheme ? colors.card : "rgba(255,255,255,0.4)",
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Описание
        </Text>
        <Text style={[styles.description, { color: colors.secondaryText }]}>
          {habit.description?.trim() || "Описание не добавлено"}
        </Text>
      </View>

      {/* Частота */}
      <View
        style={[
          styles.section,
          {
            backgroundColor: darkTheme ? colors.card : "rgba(255,255,255,0.4)",
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Частота выполнения
        </Text>
        <Text style={[styles.description, { color: colors.secondaryText }]}>
          {frequencyNames[habit.frequency] ?? habit.frequency}
        </Text>
      </View>

      {/* Дата создания */}
      <View
        style={[
          styles.section,
          {
            backgroundColor: darkTheme ? colors.card : "rgba(255,255,255,0.4)",
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Дата создания
        </Text>
        <Text style={[styles.description, { color: colors.secondaryText }]}>
          {new Date(habit.createdAt + "T00:00:00").toLocaleDateString("ru-RU")}
        </Text>
      </View>

      {/* Статистика */}
      <View
        style={[
          styles.section,
          {
            backgroundColor: darkTheme ? colors.card : "rgba(255,255,255,0.4)",
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Статистика за 30 дней
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>
              {completedCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
              Выполнено
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>
              {history.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
              Запланировано
            </Text>
          </View>
        </View>
      </View>

      {/* История */}
      <View
        style={[
          styles.section,
          {
            backgroundColor: darkTheme ? colors.card : "rgba(255,255,255,0.4)",
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          История отметок
        </Text>

        {history.length === 0 ? (
          <Text style={[styles.description, { color: colors.secondaryText }]}>
            Пока нет запланированных дней
          </Text>
        ) : (
          history.map((item) => (
            <View
              key={item.dateKey}
              style={[styles.historyItem, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.historyDate, { color: colors.text }]}>
                {item.date.toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>

              <View
                style={[
                  styles.status,
                  item.completed ? styles.completed : styles.missed,
                ]}
              >
                <Text style={styles.statusText}>
                  {item.completed ? "Выполнено" : "Не выполнено"}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9d9d9",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1c1c1c",
  },

  category: {
    fontSize: 15,
    color: "#7b5555",
    marginTop: 8,
  },

  section: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1c1c1c",
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: "#4a3b3b",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#d9655c",
  },

  statLabel: {
    fontSize: 13,
    color: "#6c5555",
    marginTop: 4,
  },

  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },

  historyDate: {
    fontSize: 14,
    color: "#3d3333",
    flex: 1,
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  completed: {
    backgroundColor: "#b8dfbd",
  },

  missed: {
    backgroundColor: "#f0b9b9",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  backGlass: {
    alignSelf: "flex-start",
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 30,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 11,
    gap: 5,
  },

  backText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#593E3E",
  },
});
