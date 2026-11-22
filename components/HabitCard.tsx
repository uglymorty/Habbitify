import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Habit } from '../types/habit';
import CheckMarker from './CheckMarker';

type HabitCardProps = {
  habit: Habit;
  checked: boolean;
  onToggle: (id: number) => void;
  onPressDetails: () => void;
};

export default function HabitCard(props: HabitCardProps) {
  const { habit, checked, onToggle, onPressDetails } = props;

  return (
    <View style={styles.habitCard}>
      <Pressable
        style={styles.habitInfo}
        onPress={onPressDetails}
      >
        <Text style={styles.habitText}>
          {habit.name}
        </Text>
      </Pressable>

      <View style={styles.checkWrap}>
        <CheckMarker
          checked={checked}
          onPress={() => onToggle(habit.id)}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 18,
    paddingVertical: 18,
    minHeight: 68,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  habitInfo: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },

  habitText: {
    fontSize: 19,
    fontWeight: '500',
    color: '#1c1c1c',
  },

  checkWrap: {
    marginLeft: 12,
  },
});