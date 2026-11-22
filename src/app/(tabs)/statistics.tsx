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

import type { Habit } from "../../../types/habit";
import { useHabits } from "../../context/HabitsContext";

// Получаем дату в формате YYYY-MM-DD.
const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Создаём дату без учёта времени.
const parseDate = (date: string) => {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);

  return new Date(year, month - 1, day);
};

// Добавляем или вычитаем дни.
const addDays = (date: Date, amount: number) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
};

// Проверяем, запланирована ли привычка на определённую дату.
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

// Получаем привычки, запланированные на конкретную дату.
const getScheduledHabits = (habits: Habit[], date: Date) => {
  const dateKey = getDateKey(date);

  return habits.filter(
    (habit) => habit.createdAt <= dateKey && isHabitScheduled(habit, date),
  );
};

// Получаем процент выполнения.
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

// Проверяем, был ли день успешным.
// null означает, что на этот день не было привычек.
const getDayStatus = (habits: Habit[], date: Date) => {
  const scheduled = getScheduledHabits(habits, date);

  if (scheduled.length === 0) {
    return null;
  }

  const dateKey = getDateKey(date);

  return scheduled.every((habit) => habit.completedDates.includes(dateKey));
};

// Текущий стрик.
const getCurrentStreak = (habits: Habit[]) => {
  const today = new Date();

  let streak = 0;
  let date = today;

  // Если сегодня есть невыполненные привычки,
  // начинаем проверку со вчерашнего дня.
  if (getDayStatus(habits, today) === false) {
    date = addDays(today, -1);
  }

  for (let i = 0; i < 3660; i++) {
    const status = getDayStatus(habits, date);

    // Если есть невыполненные привычки — стрик заканчивается.
    if (status === false) {
      break;
    }

    // Успешный день увеличивает стрик.
    if (status === true) {
      streak++;
    }

    // День без запланированных привычек пропускаем.
    date = addDays(date, -1);
  }

  return streak;
};

// Лучший стрик за всю историю.
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

// Правильное склонение слова "день".
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

// Один столбец диаграммы.
function ChartBar({ day, value }: { day: string; value: number | null }) {
  return (
    <View style={styles.barColumn}>
      <View style={styles.barArea}>
        {value !== null && (
          <LinearGradient
            colors={["#d9655c", "#b68080"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[
              styles.bar,
              {
                height: `${Math.max(value, 2)}%`,
              },
            ]}
          />
        )}
      </View>

      <Text style={styles.dayLabel}>{day}</Text>
    </View>
  );
}

// Карточка статистики.
function StatisticCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.cardTitle}>{title}</Text>

      <View style={styles.cardValueWrap}>
        <Text style={styles.cardValue}>{value}</Text>

        {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

export default function StatisticsScreen() {
  const { habits, loading } = useHabits();
  const [weekOffset, setWeekOffset] = useState(0);
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

  // Начало текущей недели — понедельник.
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

    // Будущие дни пока не отображаем как выполненные.
    const isFuture = getDateKey(date) > getDateKey(today);

    return {
      day,
      value: getProgress(habits, date),
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
      <LinearGradient colors={["#f9d9d9", "#ebc0c4"]} style={styles.gradient}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#b68080" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#f9d9d9", "#ebc0c4"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle}>Статистика</Text>
          <View style={styles.weekSwitcher}>
            <Text
              style={[styles.weekArrow, !canGoBack && styles.disabledArrow]}
              onPress={() => {
                if (canGoBack) {
                  setWeekOffset((prev) => prev - 1);
                }
              }}
            >
              ‹
            </Text>
            <View style={styles.weekTitleWrap}>
              <Text style={styles.weekTitle}>
                {formatWeekDate(monday)} – {formatWeekDate(weekSunday)}
              </Text>

              {weekOffset === 0 && (
                <Text style={styles.currentWeekLabel}>Текущая неделя</Text>
              )}
            </View>
            <Text
              style={[styles.weekArrow, !canGoForward && styles.disabledArrow]}
              onPress={() => {
                if (canGoForward) {
                  setWeekOffset((prev) => prev + 1);
                }
              }}
            >
              ›
            </Text>
          </View>
          {/* Недельная диаграмма */}
          <View style={styles.chartCard}>
            <View style={styles.chartContent}>
              <View style={styles.yAxis}>
                {[100, 80, 60, 40, 20, 0].map((value) => (
                  <Text key={value} style={styles.axisLabel}>
                    {value}%
                  </Text>
                ))}
              </View>

              <View style={styles.chartBars}>
                {[100, 80, 60, 40, 20, 0].map((value) => (
                  <View
                    key={value}
                    style={[styles.gridLine, { top: `${100 - value}%` }]}
                  />
                ))}

                {weeklyData.map((item, index) => (
                  <ChartBar key={index} day={item.day} value={item.value} />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.chartCaptionWrap}>
            <Text style={styles.chartCaption}>Ваш прогресс за неделю</Text>
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

  chartCard: {
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 10,
    borderRadius: 3,
  },

  chartContent: {
    flexDirection: "row",
    height: 145,
  },

  yAxis: {
    width: 30,
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 0,
  },

  axisLabel: {
    fontSize: 8,
    color: "#7c87a0",
  },

  chartBars: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "#dfe2e8",
  },

  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: "#e9edf3",
    borderStyle: "dotted",
  },

  barColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 1,
  },

  barArea: {
    width: "65%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  bar: {
    width: "100%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    minHeight: 2,
  },

  dayLabel: {
    position: "absolute",
    bottom: -17,
    fontSize: 9,
    color: "#7c87a0",
  },

  cardsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },

  statCard: {
    flex: 1,
    minHeight: 170,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
  },

  cardTitle: {
    fontSize: 11,
    color: "#222222",
    textAlign: "center",
  },

  cardValueWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  cardValue: {
    fontSize: 27,
    fontWeight: "700",
    color: "#080808",
    textAlign: "center",
  },

  cardSubtitle: {
    fontSize: 12,
    color: "#333333",
    marginTop: 3,
  },
  weekSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  weekTitleWrap: {
    alignItems: "center",
  },

  weekTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
  },

  currentWeekLabel: {
    fontSize: 10,
    color: "#b68080",
    marginTop: 3,
  },

  weekArrow: {
    fontSize: 32,
    color: "#b68080",
    paddingHorizontal: 12,
  },

  disabledArrow: {
    opacity: 0.25,
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
