import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type CalendarModalProps = {
  visible: boolean;
  selectedDate: Date;
  calendarMonth: Date;
  onChangeMonth: (month: Date) => void;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
};

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function CalendarModal({
  visible,
  selectedDate,
  calendarMonth,
  onChangeMonth,
  onSelectDate,
  onClose,
}: CalendarModalProps) {
  const monthLabel = calendarMonth.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });

  const calendarWeeks = useMemo(() => {
    const monthStart = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1,
    );

    const dayOffset = (monthStart.getDay() + 6) % 7;

    const daysInMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      0,
    ).getDate();

    const days: (number | null)[] = [
      ...Array.from({ length: dayOffset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];

    return Array.from(
      { length: Math.ceil(days.length / 7) },
      (_, index) => days.slice(index * 7, index * 7 + 7),
    );
  }, [calendarMonth]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.backgroundModal}>
          <View style={styles.calendarHeader}>
            <Pressable
              onPress={() =>
                onChangeMonth(
                  new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth() - 1,
                    1,
                  ),
                )
              }
              accessibilityRole="button"
              accessibilityLabel="Предыдущий месяц"
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={22} color="#1d1d1d" />
            </Pressable>

            <Text style={styles.calendarTitle}>{monthLabel}</Text>

            <Pressable
              onPress={() =>
                onChangeMonth(
                  new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth() + 1,
                    1,
                  ),
                )
              }
              accessibilityRole="button"
              accessibilityLabel="Следующий месяц"
              hitSlop={8}
            >
              <Ionicons name="chevron-forward" size={22} color="#1d1d1d" />
            </Pressable>
          </View>

          <View style={styles.calendarWeek}>
            {weekDays.map((day) => (
              <Text key={day} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          {calendarWeeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} style={styles.calendarWeek}>
              {week.map((day, dayIndex) => {
                if (day === null) {
                  return (
                    <View
                      key={`empty-${dayIndex}`}
                      style={styles.calendarDay}
                    />
                  );
                }

                const isSelected =
                  selectedDate.getFullYear() === calendarMonth.getFullYear() &&
                  selectedDate.getMonth() === calendarMonth.getMonth() &&
                  selectedDate.getDate() === day;

                return (
                  <Pressable
                    key={day}
                    style={styles.calendarDay}
                    onPress={() =>
                      onSelectDate(
                        new Date(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth(),
                          day,
                        ),
                      )
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`${day} ${monthLabel}`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <View
                      style={[
                        styles.calendarDayCircle,
                        isSelected && styles.calendarDaySelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          isSelected && styles.calendarDaySelectedText,
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}

          <Pressable
            style={styles.closeCalendarButton}
            onPress={onClose}
            accessibilityRole="button"
          >
            <Text style={styles.closeCalendarText}>Закрыть</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(29,29,29,0.35)',
  },

  backgroundModal: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#fff7f6',
  },

  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  calendarTitle: {
    color: '#1d1d1d',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  weekDay: {
    width: '14.285%',
    textAlign: 'center',
    color: '#777',
    fontSize: 13,
    fontWeight: '600',
    paddingBottom: 8,
  },

  calendarDay: {
    width: '14.285%',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarDayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarDaySelected: {
    backgroundColor: '#d9655c',
  },

  calendarDayText: {
    color: '#1d1d1d',
    fontSize: 15,
  },

  calendarDaySelectedText: {
    color: '#fff',
    fontWeight: '700',
  },

  closeCalendarButton: {
    alignSelf: 'flex-end',
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  closeCalendarText: {
    color: '#b94f48',
    fontSize: 15,
    fontWeight: '600',
  },
});