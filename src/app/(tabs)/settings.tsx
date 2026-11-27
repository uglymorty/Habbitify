import { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoutButton from "../../../components/LogoutButton";
import ReminderTimeCard from "../../../components/ReminderTimeCard";
import ReminderTimePickerCard from "../../../components/ReminderTimePickerCard";
import SettingsSwitchCard from "../../../components/SettingsSwitchCard";
import { useAuth } from "../../context/AuthContext";
import { useHabits } from "../../context/HabitsContext";
import { useTheme } from "../../context/ThemeContext";

import {
  cancelDailyNotifications,
  defaultReminderTimes,
  getReminderTimes,
  scheduleDailyNotifications,
  type ReminderPeriod,
  type ReminderTimes,
} from "../../services/notification";

const timeLabels: {
  key: ReminderPeriod;
  title: string;
  description: string;
}[] = [
  {
    key: "morning",
    title: "Утреннее напоминание",
    description: "Начало дня",
  },
  {
    key: "afternoon",
    title: "Дневное напоминание",
    description: "Проверка прогресса",
  },
  {
    key: "evening",
    title: "Вечернее напоминание",
    description: "Итоги дня",
  },
];

const timeToDate = (time: string): Date => {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();

  date.setHours(hour, minute, 0, 0);

  return date;
};

const dateToTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export default function SettingsScreen() {
  const { logout } = useAuth();
  const { habits } = useHabits();

  const { darkTheme, setDarkTheme, automaticTheme, setAutomaticTheme, colors } =
    useTheme();

  const [notifications, setNotifications] = useState(false);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);

  const [reminderTimes, setReminderTimes] =
    useState<ReminderTimes>(defaultReminderTimes);

  const [activePicker, setActivePicker] = useState<ReminderPeriod | null>(null);

  // Загрузка сохранённых настроек
  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const savedValue = await SecureStore.getItemAsync(
          "notificationsEnabled",
        );

        const enabled = savedValue === "true";
        const savedTimes = await getReminderTimes();

        setNotifications(enabled);
        setReminderTimes(savedTimes);

        if (enabled) {
          await scheduleDailyNotifications(habits, savedTimes);
        }
      } catch (error) {
        console.error("Ошибка загрузки уведомлений:", error);
      } finally {
        setNotificationsLoaded(true);
      }
    };

    loadNotificationSettings();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  // Включение и выключение уведомлений
  const handleNotificationsChange = async (value: boolean) => {
    try {
      if (value) {
        await scheduleDailyNotifications(habits, reminderTimes);
      } else {
        await cancelDailyNotifications();
      }

      await SecureStore.setItemAsync("notificationsEnabled", String(value));

      setNotifications(value);

      Alert.alert(
        value ? "Уведомления включены 🔔" : "Уведомления выключены",
        value
          ? `Напоминания будут приходить в ${reminderTimes.morning}, ${reminderTimes.afternoon} и ${reminderTimes.evening}.`
          : "Ежедневные напоминания отключены.",
      );
    } catch (error) {
      console.error("Ошибка настройки уведомлений:", error);

      Alert.alert("Ошибка", "Не удалось изменить настройки уведомлений.");
    }
  };

  // Изменение времени напоминания
  const handleTimeChange = async (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === "set" && selectedDate && activePicker) {
      const newTime = dateToTime(selectedDate);

      const updatedTimes = {
        ...reminderTimes,
        [activePicker]: newTime,
      };

      setReminderTimes(updatedTimes);

      try {
        await SecureStore.setItemAsync(`reminderTime_${activePicker}`, newTime);

        if (notifications) {
          await scheduleDailyNotifications(habits, updatedTimes);
        }
      } catch (error) {
        console.error("Ошибка сохранения времени:", error);

        Alert.alert("Ошибка", "Не удалось сохранить время уведомления.");
      }
    }

    if (Platform.OS === "android" || event.type === "dismissed") {
      setActivePicker(null);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>Настройки</Text>

        {/* Внешний вид */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Внешний вид
        </Text>

        <SettingsSwitchCard
          icon="phone-portrait-outline"
          title="Автоматическая тема"
          description="Следовать настройкам темы устройства"
          value={automaticTheme}
          onValueChange={setAutomaticTheme}
          thumbColor={automaticTheme ? "#ffffff" : "#f4f4f4"}
        />

        {!automaticTheme && (
          <SettingsSwitchCard
            icon="moon-outline"
            title="Тёмная тема"
            value={darkTheme}
            onValueChange={setDarkTheme}
          />
        )}

        {/* Уведомления */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Уведомления
        </Text>

        <SettingsSwitchCard
          icon="notifications-outline"
          title="Уведомления"
          value={notifications}
          onValueChange={handleNotificationsChange}
          disabled={!notificationsLoaded}
          trackColorFalse="#d69c9c"
        />

        {/* Время уведомлений */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Время напоминаний
        </Text>

        {timeLabels.map((item) => (
          <ReminderTimeCard
            key={item.key}
            title={item.title}
            description={item.description}
            time={reminderTimes[item.key]}
            onPress={() => setActivePicker(item.key)}
          />
        ))}

        {activePicker && (
          <ReminderTimePickerCard
            value={timeToDate(reminderTimes[activePicker])}
            darkTheme={darkTheme}
            onChange={handleTimeChange}
            onDone={() => setActivePicker(null)}
          />
        )}

        <LogoutButton onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 15,
  },
});
