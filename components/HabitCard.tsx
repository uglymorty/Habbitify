import { StyleSheet, Text, View } from 'react-native';
import type { Habit } from '../types/habit';
import CheckMarker from './CheckMarker';

type HabitCardProps = {
  habit: Habit;
  onToggle: (id: number) => void;
};

export default function HabitCard({ habit, onToggle }: HabitCardProps) {
  return (
    <View style={styles.habitCard}>
      <View style={styles.habitInfo}>
        <Text style={styles.habitText}>{habit.name}</Text>
      </View>

      <View style={styles.checkWrap}>
        <CheckMarker
          checked={habit.checked}
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