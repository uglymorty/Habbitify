import React from "react";
import { FlatList, StyleSheet } from "react-native";

import ListEmptyComponent from "../components/ListEmptyComponent";
import SwipeableHabitCard from "../components/SwipeableHabitCard";
import type { Habit } from "../types/habit";

type HomeHabitsListProps = {
  habits: Habit[];
  selectedDateKey: string;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (habit: Habit) => void;
  onPressDetails: (habit: Habit) => void;
  onAddHabit: () => void;
};

export default function HomeHabitsList({
  habits,
  selectedDateKey,
  onToggle,
  onDelete,
  onEdit,
  onPressDetails,
  onAddHabit,
}: HomeHabitsListProps) {
  return (
    <FlatList
      data={habits}
      keyExtractor={(habit) => String(habit.id)}
      style={styles.list}
      renderItem={({ item: habit }) => (
        <SwipeableHabitCard
          habit={habit}
          checked={habit.completedDates.includes(selectedDateKey)}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onPressDetails={() => onPressDetails(habit)}
        />
      )}
      ListEmptyComponent={<ListEmptyComponent onAddHabit={onAddHabit} />}
      showsVerticalScrollIndicator={false}
      scrollEnabled={habits.length > 0}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 8,
  },
});
