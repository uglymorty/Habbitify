
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { GlassView } from 'expo-glass-effect';
import categories from '../../../constants/categories';
import type { Habit } from '../../../types/habit';
import { useHabits } from '../../context/HabitsContext';

const frequencyNames: Record<string, string> = {
  daily: 'Каждый день',
  weekly: 'Еженедельно',
  monthly: 'Ежемесячно',
  yearly: 'Ежегодно',
};

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const isHabitScheduled = (habit: Habit, date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const weekDay = date.getDay();

  switch (habit.frequency) {
    case 'daily':
      return true;

    case 'weekly':
      return habit.selectedDays?.includes(weekDay) ?? false;

    case 'monthly': {
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();

      return day === Math.min(habit.dayOfMonth ?? 1, lastDay);
    }

    case 'yearly':
      return (
        day === habit.dayOfMonth &&
        month === habit.monthOfYear
      );

    default:
      return false;
  }
};

export default function HabitDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits } = useHabits();

  const habit = habits.find(
    (item) => String(item.id) === id
  );

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
    categories.find((item) => item.value === habit.category)?.label
    ?? habit.category;

  const today = new Date();
  const todayKey = getDateKey(today);

  // Формируем историю за последние 30 дней
  const history = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - index
    );

    const dateKey = getDateKey(date);

    return {
      date,
      dateKey,
      scheduled: isHabitScheduled(habit, date),
      completed: habit.completedDates.includes(dateKey),
    };
  })
    .filter(
      (item) =>
        item.dateKey >= habit.createdAt &&
        item.dateKey <= todayKey &&
        item.scheduled
    );

  const completedCount = history.filter(
    (item) => item.completed
  ).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Кнопка назад */}
      <GlassView
         glassEffectStyle="regular"
         isInteractive
         style={styles.backGlass}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color="#593E3E"
          />

          <Text style={styles.backText}>Назад</Text>
        </Pressable>
      </GlassView>

      {/* Название */}
      <View style={styles.header}>
        <Text style={styles.title}>{habit.name}</Text>
        <Text style={styles.category}>{categoryName}</Text>
      </View>

      {/* Описание */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Описание</Text>
        <Text style={styles.description}>
          {habit.description?.trim() || 'Описание не добавлено'}
        </Text>
      </View>

      {/* Частота */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Частота выполнения</Text>
        <Text style={styles.description}>
          {frequencyNames[habit.frequency] ?? habit.frequency}
        </Text>
      </View>

      {/* Дата создания */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Дата создания</Text>
        <Text style={styles.description}>
          {new Date(habit.createdAt + 'T00:00:00').toLocaleDateString('ru-RU')}
        </Text>
      </View>

      {/* Статистика */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Статистика за 30 дней</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {completedCount}
            </Text>
            <Text style={styles.statLabel}>Выполнено</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {history.length}
            </Text>
            <Text style={styles.statLabel}>Запланировано</Text>
          </View>
        </View>
      </View>

      {/* История */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>История отметок</Text>

        {history.length === 0 ? (
          <Text style={styles.description}>
            Пока нет запланированных дней
          </Text>
        ) : (
          history.map((item) => (
            <View key={item.dateKey} style={styles.historyItem}>
              <Text style={styles.historyDate}>
                {item.date.toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>

              <View
                style={[
                  styles.status,
                  item.completed
                    ? styles.completed
                    : styles.missed,
                ]}
              >
                <Text style={styles.statusText}>
                  {item.completed ? 'Выполнено' : 'Не выполнено'}
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
    backgroundColor: '#f9d9d9',
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
    fontWeight: '700',
    color: '#1c1c1c',
  },

  category: {
    fontSize: 15,
    color: '#7b5555',
    marginTop: 8,
  },

  section: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1c1c1c',
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: '#4a3b3b',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statItem: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#d9655c',
  },

  statLabel: {
    fontSize: 13,
    color: '#6c5555',
    marginTop: 4,
  },

  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },

  historyDate: {
    fontSize: 14,
    color: '#3d3333',
    flex: 1,
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  completed: {
    backgroundColor: '#b8dfbd',
  },

  missed: {
    backgroundColor: '#f0b9b9',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  backGlass: {
  alignSelf: 'flex-start',
  borderRadius: 30,
  overflow: 'hidden',
  marginBottom: 30,
},

backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 18,
  paddingVertical: 11,
  gap: 5,
},

backText: {
  fontSize: 15,
  fontWeight: '600',
  color: '#593E3E',
},
});
