import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddHabitModal from '../../../components/AddHabitModal';
import CalendarModal from '../../../components/CalendarModal';
import HomeHeader from '../../../components/HomeHeader';
import ListEmptyComponent from '../../../components/ListEmptyComponent';
import SemiCircleProgress from '../../../components/SemiCircleProgress';
import SwipeableHabitCard from '../../../components/SwipeableHabitCard';
import categories from '../../../constants/categories';
import { Habit } from '../../../types/habit';


type AccountProfile = {
  firstName: string;
  lastName: string;
  photoUri: string | null;
};

const account: AccountProfile = {
  firstName: 'Name',
  lastName: 'Surname',
  photoUri: null,
};

export default function Index() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: 'Выпить 2 литра воды', category: 'health', createdAt: '2026-11-10', completedDates: []},
    { id: 2, name: 'Сходить в спортзал', category: 'sport', createdAt: '2026-11-10', completedDates: [] },
  ]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
  const selectedDateLabel = selectedDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const moveSelectedDate = (amount: number) => {
    setSelectedDate((date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount));
  };

  const openCalendar = () => {
    setCalendarMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    setCalendarVisible(true);
  };

  const openAddHabitModal = () => {
    setNewHabitName('');
    setSelectedCategory('');
    setEditingHabitId(null);
    setAddModalVisible(true);
  }
  const addHabit = () => {
  const trimmedName = newHabitName.trim();

  if (trimmedName === '') {
    return;
  }

  if (editingHabitId !== null) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) =>
        habit.id === editingHabitId
          ? {
              ...habit,
              name: trimmedName,
              category: selectedCategory,
            }
          : habit
      )
    );
  } else {
    const newHabit = {
      id: Date.now(),
      name: trimmedName,
      category: selectedCategory,
      createdAt: selectedDateKey,
      completedDates: [],
    };

    setHabits((currentHabits) => [...currentHabits, newHabit]);
  }

  setNewHabitName('');
  setSelectedCategory('');
  setEditingHabitId(null);
  setAddModalVisible(false);
};

const toggleHabit = (id: number) => {
  setHabits((prevHabits) =>
    prevHabits.map((habit) => {
      if (habit.id !== id) {
        return habit;
      }

      const isCompleted = habit.completedDates.includes(selectedDateKey);

      let updatedDates: string[];

      if (isCompleted) {
        updatedDates = habit.completedDates.filter(
          (date) => date !== selectedDateKey
        );
      } else {
        updatedDates = [...habit.completedDates, selectedDateKey];
      }

      return {
        ...habit,
        completedDates: updatedDates,
      };
    })
  );
};
  const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

  const deleteHabit = (id: number) => {
    setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== id));
  };

  const startEditHabit = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setNewHabitName(habit.name);
    setSelectedCategory(habit.category);
    setAddModalVisible(true);
  };

  const selectedDateKey = getDateKey(selectedDate);
  const completedCount = habits.filter((habit) =>
     habit.completedDates.includes(selectedDateKey)
  ).length;
  const progress = 
    habits.length > 0
      ? completedCount / habits.length : 0;
  
  const progressPercent = Math.round(progress * 100);

  return (
    <LinearGradient colors={['#f9d9d9', '#ebc0c4']} style={styles.gradient}>
      <View style={styles.pattern} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <HomeHeader
            firstName={account.firstName}
            lastName={account.lastName}
            photoUri={account.photoUri}
            onOpenCalendar={openCalendar}
          />

          <View style={styles.progressWrap}>
            <SemiCircleProgress progress={progress} value={progressPercent} label="for today" caption="Progress" />
          </View>

          <View style={styles.dateRow}>
            <Pressable
              onPress={() => moveSelectedDate(-1)}
              accessibilityRole="button"
              accessibilityLabel="Предыдущий день"
              hitSlop={8}
            >
              <Text style={styles.arrow}>{'<'}</Text>
            </Pressable>
            <Text style={styles.dateLabel}>{selectedDateLabel}</Text>
            <Pressable
              onPress={() => moveSelectedDate(1)}
              accessibilityRole="button"
              accessibilityLabel="Следующий день"
              hitSlop={8}
            >
              <Text style={styles.arrow}>{'>'}</Text>
            </Pressable>
          </View>

          <FlatList
            data={habits.filter((habit)=> habit.createdAt <= selectedDateKey)}
            keyExtractor={(habit) => String(habit.id)}
            style={styles.list}
            renderItem={({ item: habit }) => (
              <SwipeableHabitCard
                habit={habit}
                checked={habit.completedDates.includes(selectedDateKey)}
                onToggle={toggleHabit}
                onDelete={deleteHabit}
                onEdit={startEditHabit}
              />
            )}
            ListEmptyComponent={
              <ListEmptyComponent
                 onAddHabit={openAddHabitModal}
              />
            }
            showsVerticalScrollIndicator={false}
            scrollEnabled={habits.length > 0}
          />

          <TouchableOpacity 
            style={styles.fab} 
            activeOpacity={0.9}
            onPress={openAddHabitModal}
            >
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <CalendarModal
        visible={isCalendarVisible}
        selectedDate={selectedDate}
        calendarMonth={calendarMonth}
        onChangeMonth={setCalendarMonth}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setCalendarVisible(false);
        }}
        onClose={() => setCalendarVisible(false)}
      />

      <AddHabitModal
        visible={isAddModalVisible}
        habitName={newHabitName}
        selectedCategory={selectedCategory}
        categories={categories}
        onChangeName={setNewHabitName}
        onChangeCategory={setSelectedCategory}
        onAdd={addHabit}
        onCancel={() => setAddModalVisible(false)}
        isEditing={editingHabitId !== null}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    position: 'relative',
  },
  pattern: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(255,255,255,0.08)',
    opacity: 0.65,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 12,
    paddingBottom: 28,
    position: 'relative',
  },
  progressWrap: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  arrow: {
    fontSize: 28,
    color: '#1c1c1c',
    lineHeight: 28,
    fontWeight: '300',
    opacity: 0.8,
  },
  dateLabel: {
    fontSize: 20,
    color: '#1b1b1b',
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'capitalize',
  },
  list: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 22,
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#d9655c',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 6,
  },
  fabText: {
    color: '#fff',
    fontSize: 52,
    lineHeight: 55,
    fontWeight: '300',
  },
});
