import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatisticCard from "../../../components/StatisticCard";
import WeeklyChart from "../../../components/WeeklyChart";
import WeekSwitcher from "../../../components/WeekSwitcher";
import type { Habit } from "../../../types/habit";
import { useHabits } from "../../context/HabitsContext";

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDate = (date: string) => {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);

  return new Date(year, month - 1, day);
};

const addDays = (date: Date, amount: number) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
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

      const targetDay = Math.min(habit.dayOfMonth ?? 1, lastDay);

      return day === targetDay;
    }

    case "yearly":
      return (
        day === (habit.dayOfMonth ?? 1) && month === (habit.monthOfYear ?? 1)
      );

    default:
      return false;
  }
};

const getScheduledHabits = (habits: Habit[], date: Date) => {
  const dateKey = getDateKey(date);

  return habits.filter(
    (habit) => habit.createdAt <= dateKey && isHabitScheduled(habit, date),
  );
};

const getProgress = (habits: Habit[], date: Date) => {
  const scheduled = getScheduledHabits(habits, date);

  if (scheduled.length === 0) {
    return 0;
  }

  const dateKey = getDateKey(date);

  const completed = scheduled.filter((habit) =>
    habit.completedDates.includes(dateKey),
  ).length;

  return Math.round((completed / scheduled.length) * 100);
};

const getDayStatus = (habits: Habit[], date: Date) => {
  const scheduled = getScheduledHabits(habits, date);

  if (scheduled.length === 0) {
    return null;
  }

  const dateKey = getDateKey(date);

  return scheduled.every((habit) => habit.completedDates.includes(dateKey));
};

const getCurrentStreak = (habits: Habit[]) => {
  const today = new Date();

  let streak = 0;
  let date = today;

  if (getDayStatus(habits, today) === false) {
    date = addDays(today, -1);
  }

  for (let i = 0; i < 3660; i++) {
    const status = getDayStatus(habits, date);

    if (status === false) {
      break;
    }

    if (status === true) {
      streak++;
    }

    date = addDays(date, -1);
  }

  return streak;
};

const getBestStreak = (habits: Habit[]) => {
  if (habits.length === 0) {
    return 0;
  }

  const earliestDate = habits.reduce((earliest, habit) => {
    return habit.createdAt < earliest ? habit.createdAt : earliest;
  }, habits[0].createdAt);

  const startDate = parseDate(earliestDate);
  const today = new Date();

  let currentStreak = 0;
  let bestStreak = 0;

  for (let date = startDate; date <= today; date = addDays(date, 1)) {
    const status = getDayStatus(habits, date);

    if (status === true) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else if (status === false) {
      currentStreak = 0;
    }
  }

  return bestStreak;
};

const getDaysLabel = (value: number) => {
  const lastTwo = value % 100;
  const last = value % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return "дней";
  }

  if (last === 1) {
    return "день";
  }

  if (last >= 2 && last <= 4) {
    return "дня";
  }

  return "дней";
};

export default function StatisticsScreen() {
  const { habits, loading } = useHabits();
  const [weekOffset, setWeekOffset] = useState(0);
  const { colors } = useTheme();
  console.log(
    "Проверка привычек для статистики:",
    habits.map((habit) => ({
      name: habit.name,
      frequency: habit.frequency,
      selectedDays: habit.selectedDays,
      dayOfMonth: habit.dayOfMonth,
      monthOfYear: habit.monthOfYear,
      createdAt: habit.createdAt,
      completedDates: habit.completedDates,
    })),
  );

  const today = new Date();

  const todayProgress = getProgress(habits, today);

  const currentStreak = getCurrentStreak(habits);
  const bestStreak = getBestStreak(habits);

  const currentMonday = addDays(today, -((today.getDay() + 6) % 7));
  const monday = addDays(currentMonday, weekOffset * 7);
  const canGoBack = weekOffset > -2;
  const canGoForward = weekOffset < 2;
  const weekSunday = addDays(monday, 6);
  const formatWeekDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    });
  };

  const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const weeklyData = weekdays.map((day, index) => {
    const date = addDays(monday, index);

    const isFuture = getDateKey(date) > getDateKey(today);

    return {
      day,
      value: isFuture ? null : getProgress(habits, date),
    };
  });
  console.log(
    "Проверка запланированных привычек:",
    weekdays.map((day, index) => {
      const date = addDays(monday, index);

      return {
        day,
        date: getDateKey(date),
        scheduled: getScheduledHabits(habits, date).map((habit) => habit.name),
        progress: getProgress(habits, date),
      };
    }),
  );

  console.log(
    "Проверка статистики:",
    habits.map((habit) => ({
      name: habit.name,
      frequency: habit.frequency,
      selectedDays: habit.selectedDays,
      dayOfMonth: habit.dayOfMonth,
      monthOfYear: habit.monthOfYear,
      createdAt: habit.createdAt,
      completedDates: habit.completedDates,
    })),
  );
  console.log("Статистика:", {
    habitsCount: habits.length,
    today: getDateKey(today),
    weeklyData,
  });

  if (loading) {
    return (
      <LinearGradient
        colors={[colors.background, colors.background]}
        style={styles.gradient}
      >
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#b68080" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background, colors.background]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.screenTitle, { color: colors.text }]}>
            Статистика
          </Text>
          <WeekSwitcher
            weekLabel={`${formatWeekDate(monday)} – ${formatWeekDate(weekSunday)}`}
            isCurrentWeek={weekOffset === 0}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            onPrevious={() => setWeekOffset((prev) => prev - 1)}
            onNext={() => setWeekOffset((prev) => prev + 1)}
          />
          <WeeklyChart data={weeklyData} />
          <View style={styles.chartCaptionWrap}>
            <Text style={[styles.chartCaption, { color: colors.accent }]}>
              Ваш прогресс за неделю
            </Text>
          </View>

          {/* Верхние карточки */}
          <View style={styles.cardsRow}>
            <StatisticCard
              title="Ваш прогресс за сегодня"
              value={`${todayProgress}%`}
            />

            <StatisticCard
              title="Ваш текущий стрик"
              value={`${currentStreak} ${getDaysLabel(currentStreak)}`}
            />
          </View>

          {/* Нижние карточки */}
          <View style={styles.cardsRow}>
            <StatisticCard
              title="Количество привычек"
              value={String(habits.length)}
              subtitle="привычек"
            />

            <StatisticCard
              title="Лучший стрик"
              value={`${bestStreak} ${getDaysLabel(bestStreak)}`}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 12,
    paddingBottom: 0,
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  screenTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 12,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  chartCaptionWrap: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },

  chartCaption: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8f555d",
    letterSpacing: 0.4,
  },
});
