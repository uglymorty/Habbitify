import type { Habit } from "../../types/habit";

export const isHabitScheduled = (habit: Habit, date: Date): boolean => {
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
      return day === habit.dayOfMonth && month === habit.monthOfYear;

    default:
      return false;
  }
};
