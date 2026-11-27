import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import type { Habit } from "../../types/habit";

export type ReminderPeriod = "morning" | "afternoon" | "evening";

export type ReminderTimes = {
  morning: string;
  afternoon: string;
  evening: string;
};

export const defaultReminderTimes: ReminderTimes = {
  morning: "10:00",
  afternoon: "14:00",
  evening: "20:00",
};

// Получение сохранённого времени уведомлений
export async function getReminderTimes(): Promise<ReminderTimes> {
  const morning = await SecureStore.getItemAsync("reminderTime_morning");
  const afternoon = await SecureStore.getItemAsync("reminderTime_afternoon");
  const evening = await SecureStore.getItemAsync("reminderTime_evening");

  return {
    morning: morning ?? defaultReminderTimes.morning,
    afternoon: afternoon ?? defaultReminderTimes.afternoon,
    evening: evening ?? defaultReminderTimes.evening,
  };
}

// Настройка отображения уведомлений,
// когда приложение открыто
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Запрос разрешения
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

// Форматирование даты
const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Проверка, запланирована ли привычка на дату
const isHabitScheduled = (habit: Habit, date: Date): boolean => {
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
      return (
        day === (habit.dayOfMonth ?? 1) && month === (habit.monthOfYear ?? 1)
      );

    default:
      return false;
  }
};

// Получение привычек, запланированных на определённую дату
const getTodayHabits = (habits: Habit[], date: Date): Habit[] => {
  const dateKey = getDateKey(date);

  return habits.filter(
    (habit) => habit.createdAt <= dateKey && isHabitScheduled(habit, date),
  );
};

// Расчёт стрика
const getCurrentStreak = (habits: Habit[]): number => {
  const today = new Date();

  const addDays = (date: Date, amount: number) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

  const getDayStatus = (date: Date): boolean | null => {
    const scheduled = getTodayHabits(habits, date);

    if (scheduled.length === 0) {
      return null;
    }

    const dateKey = getDateKey(date);

    return scheduled.every((habit) => habit.completedDates.includes(dateKey));
  };

  let streak = 0;
  let date = today;

  if (getDayStatus(today) === false) {
    date = addDays(today, -1);
  }

  for (let i = 0; i < 3660; i++) {
    const status = getDayStatus(date);

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

// Формирование сообщения
// Формирование сообщения для конкретной даты
const getReminderMessage = (
  habits: Habit[],
  period: ReminderPeriod,
  date: Date,
): { title: string; body: string } => {
  const todayHabits = getTodayHabits(habits, date);
  const dateKey = getDateKey(date);

  const completed = todayHabits.filter((habit) =>
    habit.completedDates.includes(dateKey),
  ).length;

  const total = todayHabits.length;
  const remaining = total - completed;
  const streak = getCurrentStreak(habits);

  if (period === "morning") {
    return {
      title: "Доброе утро! ☀️",
      body:
        total === 0
          ? "Сегодня нет запланированных привычек. Отличный день для новых целей!"
          : `Сегодня тебя ждёт ${total} привычек. Начни день и сохрани свой стрик 🔥`,
    };
  }

  if (period === "afternoon") {
    return {
      title: "Время проверить привычки! 🔥",
      body:
        total === 0
          ? "Сегодня нет запланированных привычек. Отдыхай и планируй новые цели!"
          : `Выполнено ${completed} из ${total}. Осталось: ${remaining}. Твой стрик: ${streak} дн. Не останавливайся!`,
    };
  }

  return {
    title: "Вечерний итог 🌙",
    body:
      total === 0
        ? "Сегодня нет запланированных привычек. Хорошего вечера!"
        : `Выполнено ${completed} из ${total}. Осталось ${remaining} привычек. Не дай сегодняшнему дню прервать твой стрик!`,
  };
};

// Очередь для последовательного выполнения операций
let notificationQueue: Promise<void> = Promise.resolve();

const runNotificationTask = (task: () => Promise<void>): Promise<void> => {
  const operation = notificationQueue.then(task, task);
  notificationQueue = operation.catch(() => {});
  return operation;
};

// Внутренняя отмена уведомлений
async function cancelDailyNotificationsInternal(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  const habitifyNotifications = scheduled.filter(
    (notification) => notification.content.data?.habitifyReminder === true,
  );

  for (const notification of habitifyNotifications) {
    await Notifications.cancelScheduledNotificationAsync(
      notification.identifier,
    );
  }

  console.log("Отменено уведомлений Habitify:", habitifyNotifications.length);
}

// Публичная отмена уведомлений
export function cancelDailyNotifications(): Promise<void> {
  return runNotificationTask(cancelDailyNotificationsInternal);
}

// Проверка, выполнены ли все привычки за день
const areAllHabitsCompleted = (habits: Habit[], date: Date): boolean => {
  const scheduled = getTodayHabits(habits, date);

  if (scheduled.length === 0) {
    return false;
  }

  const dateKey = getDateKey(date);

  return scheduled.every((habit) => habit.completedDates.includes(dateKey));
};

// Отправка поздравления только один раз за день
async function sendCompletionNotificationInternal(
  habits: Habit[],
): Promise<void> {
  const today = new Date();
  const dateKey = getDateKey(today);
  const storageKey = `completionCongrats_${dateKey}`;

  if (!areAllHabitsCompleted(habits, today)) {
    return;
  }

  const alreadySent = await SecureStore.getItemAsync(storageKey);

  if (alreadySent === "true") {
    return;
  }

  const streak = getCurrentStreak(habits);
  const total = getTodayHabits(habits, today).length;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Все привычки выполнены! 🎉",
      body: `Ты выполнил все ${total} привычек. Твой стрик: ${streak} дн. Отличная работа!`,
      sound: true,
      data: {
        habitifyReminder: true,
        completionCongrats: true,
      },
    },
    trigger: null,
  });

  await SecureStore.setItemAsync(storageKey, "true");

  console.log("Поздравление за сегодня отправлено");
}

// Публичная функция отправки поздравления
export function sendCompletionNotification(habits: Habit[]): Promise<void> {
  return runNotificationTask(() => sendCompletionNotificationInternal(habits));
}

// Планирование уведомлений на 20 дней вперёд
export function scheduleDailyNotifications(
  habits: Habit[] = [],
  customTimes?: ReminderTimes,
  sendCompletionIfNeeded = false,
): Promise<void> {
  return runNotificationTask(async () => {
    const hasPermission = await requestNotificationPermissions();

    if (!hasPermission) {
      throw new Error("Разреши приложению отправлять уведомления");
    }

    await cancelDailyNotificationsInternal();

    const times = customTimes ?? (await getReminderTimes());

    const reminders: {
      period: ReminderPeriod;
      time: string;
    }[] = [
      { period: "morning", time: times.morning },
      { period: "afternoon", time: times.afternoon },
      { period: "evening", time: times.evening },
    ];

    const now = new Date();

    for (let dayOffset = 0; dayOffset < 20; dayOffset++) {
      const notificationDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + dayOffset,
      );

      // Если все привычки сегодня выполнены,
      // отправляем одно поздравление и пропускаем напоминания.
      if (dayOffset === 0 && areAllHabitsCompleted(habits, notificationDate)) {
        if (sendCompletionIfNeeded) {
          await sendCompletionNotificationInternal(habits);
        }

        continue;
      }

      for (const reminder of reminders) {
        const [hour, minute] = reminder.time.split(":").map(Number);

        if (
          !Number.isInteger(hour) ||
          !Number.isInteger(minute) ||
          hour < 0 ||
          hour > 23 ||
          minute < 0 ||
          minute > 59
        ) {
          throw new Error(`Некорректное время: ${reminder.time}`);
        }

        const triggerDate = new Date(notificationDate);
        triggerDate.setHours(hour, minute, 0, 0);

        // Не создаём уведомления на прошедшее время
        if (triggerDate <= now) {
          continue;
        }

        const message = getReminderMessage(
          habits,
          reminder.period,
          notificationDate,
        );

        await Notifications.scheduleNotificationAsync({
          content: {
            title: message.title,
            body: message.body,
            sound: true,
            data: {
              habitifyReminder: true,
              reminderPeriod: reminder.period,
            },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
          },
        });
      }
    }

    const result = await Notifications.getAllScheduledNotificationsAsync();

    const activeReminders = result.filter(
      (notification) => notification.content.data?.habitifyReminder === true,
    );

    console.log(
      "Актуальное количество уведомлений Habitify:",
      activeReminders.length,
    );

    console.log("Уведомления запланированы на 20 дней вперёд");
  });
}
