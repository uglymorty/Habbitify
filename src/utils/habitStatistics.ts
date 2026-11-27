import type { Habit } from "../../types/habit";

type HabitStatistics = {
  completedCount: number;
  progress: number;
  progressPercent: number;
};

export const getHabitStatistics = (
  habits: Habit[],
  selectedDateKey: string,
): HabitStatistics => {
  const completedCount = habits.filter((habit) =>
    habit.completedDates.includes(selectedDateKey),
  ).length;

  const progress = habits.length > 0 ? completedCount / habits.length : 0;

  const progressPercent = Math.round(progress * 100);

  return {
    completedCount,
    progress,
    progressPercent,
  };
};
