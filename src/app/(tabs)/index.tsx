import { Ionicons } from '@expo/vector-icons';
import { GlassView } from 'expo-glass-effect';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import SemiCircleProgress from '../../../components/SemiCircleProgress';

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

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function Index() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [hasPhotoLoadError, setHasPhotoLoadError] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [habits, setHabits] = useState([
    { id: 1, name: 'Выпить 2 литра воды', category: 'health', checked: true },
    { id: 2, name: 'Сходить в спортзал', category: 'sport', checked: false },
  ]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const initials = `${account.firstName.trim().charAt(0)}${account.lastName.trim().charAt(0)}`.toLocaleUpperCase('ru-RU');
  const monthLabel = calendarMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const dayOffset = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const calendarDays = [
    ...Array.from({ length: dayOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const calendarWeeks = Array.from(
    { length: Math.ceil(calendarDays.length / 7) },
    (_, index) => calendarDays.slice(index * 7, index * 7 + 7),
  );
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
  const addHabit = () => {
    const trimmedName = newHabitName.trim();
    if(trimmedName==='') {
      return;
    }
    const newHabit = { id: Date.now(), name: trimmedName, category: selectedCategory, checked: false };
    setHabits((currentHabits) => [...currentHabits, newHabit]);
    setNewHabitName('');
    setAddModalVisible(false);
  };

  const categories = [
    {label: 'Здоровье', value: 'health'},
    {label: 'Спорт', value: 'sport'},
    {label: 'Обучение', value: 'education'},
    {label: 'Саморазвитие', value: 'self-development'},
    {label: 'Другое', value: 'other'},
  ];

  const toggleHabit = (id: number) => {
    setHabits((currentHabits) =>
    currentHabits.map((habit) =>
     habit.id === id ? {...habit, checked: !habit.checked}: habit))
  };


  

  return (
    <LinearGradient colors={['#f9d9d9', '#ebc0c4']} style={styles.gradient}>
      <View style={styles.pattern} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              {account.photoUri && !hasPhotoLoadError ? (
                <Image
                  source={{ uri: account.photoUri }}
                  style={styles.avatarImage}
                  contentFit="cover"
                  accessibilityLabel={`${account.firstName} ${account.lastName}`}
                  onError={() => setHasPhotoLoadError(true)}
                />
              ) : (
                <Text style={styles.avatarInitials}>{initials}</Text>
              )}
            </View>
            <Pressable
              style={styles.calendarButton}
              onPress={openCalendar}
              accessibilityRole="button"
              accessibilityLabel="Открыть календарь"
            >
              <GlassView style={styles.calendarButtonGlass} glassEffectStyle="clear" isInteractive>
                <Ionicons name="calendar-outline" size={24} color="#1d1d1d" />
              </GlassView>
            </Pressable>
          </View>

          <View style={styles.progressWrap}>
            <SemiCircleProgress progress={1} value={100} label="for today" caption="Progress" />
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
            data={habits}
            keyExtractor={(habit) => String(habit.id)}
            style={styles.list}
            renderItem={({ item: habit }) => (
              <View style={styles.habitCard}>
                <Text style={styles.habitText}>{habit.name}</Text>
                <View style={styles.checkWrap}>
                  <Pressable
                    onPress={() => toggleHabit(habit.id)}
                    style={habit.checked ? styles.checkFilled : styles.checkEmpty}
                  >
                    {habit.checked ? <Text style={styles.checkMark}>✓</Text> : null}
                  </Pressable>
                </View>
              </View>
            )}
          />

          <TouchableOpacity 
            style={styles.fab} 
            activeOpacity={0.9}
            onPress={() => setAddModalVisible(true)}
            >
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={isCalendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.backgroundModal}>
            <View style={styles.calendarHeader}>
              <Pressable
                onPress={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                accessibilityRole="button"
                accessibilityLabel="Предыдущий месяц"
                hitSlop={8}
              >
                <Ionicons name="chevron-back" size={22} color="#1d1d1d" />
              </Pressable>
              <Text style={styles.calendarTitle}>{monthLabel}</Text>
              <Pressable
                onPress={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
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
                    return <View key={`empty-${dayIndex}`} style={styles.calendarDay} />;
                  }

                  const isSelected =
                    selectedDate.getFullYear() === calendarMonth.getFullYear() &&
                    selectedDate.getMonth() === calendarMonth.getMonth() &&
                    selectedDate.getDate() === day;

                  return (
                    <Pressable
                      key={day}
                      style={styles.calendarDay}
                      onPress={() => {
                        setSelectedDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day));
                        setCalendarVisible(false);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`${day} ${monthLabel}`}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <View style={[styles.calendarDayCircle, isSelected && styles.calendarDaySelected]}>
                        <Text style={[styles.calendarDayText, isSelected && styles.calendarDaySelectedText]}>
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
              onPress={() => setCalendarVisible(false)}
              accessibilityRole="button"
            >
              <Text style={styles.closeCalendarText}>Закрыть</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={isAddModalVisible} transparent animationType="fade" onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.modalBackdrop}>
            <View style={styles.backgroundModal}>
                <Text style={styles.addModalTitle}>
                   Новая привычка
                </Text>
                <TextInput
                  placeholder="Введите привычку" 
                  placeholderTextColor="#999"
                  value={newHabitName}
                  onChangeText={setNewHabitName}
                  style={styles.habitInput}
                />
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={categories}
                  labelField="label"
                  valueField="value"
                  placeholder="Выберите категорию"
                  value={selectedCategory}
                  onChange={item => {
                    setSelectedCategory(item.value);
                  }}
                />
                <View style={styles.addModalButtons}>
                   <Pressable
                    style={styles.closeCalendarButton}
                    onPress={() => {
                      setAddModalVisible(false);
                      setNewHabitName('');
                    }}
                   >
                     <Text style={styles.closeCalendarText}>Отмена</Text>
                   </Pressable>
                   <Pressable
                     style={styles.addButton}
                     onPress={addHabit}
                   >
                     <Text style={styles.addButtonText}>Добавить</Text>
                   </Pressable>
                </View>
            </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.48)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    color: '#1d1d1d',
    fontSize: 18,
    fontWeight: '700',
  },
  calendarButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
  },
  calendarButtonGlass: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: -25
  },
  list: {
    marginTop: 8,
  },
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
  habitText: {
    fontSize: 19,
    fontWeight: '500',
    color: '#1c1c1c',
  },
  checkWrap: {
    marginLeft: 12,
  },
  checkEmpty: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(28,28,28,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkFilled: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1d1d1d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#f6dfe1',
    fontSize: 16,
    fontWeight: '700',
    transform: [{ translateY: 0 }],
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
  addModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 18,
  },
  habitInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#e0c5c5',
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#1d1d1d',
    backgroundColor: '#ffffff',
  },
  addModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  addButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#d9655c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600'
  },
  dropdown: {
    height: 50,
    borderColor: '#e0c5c5',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginTop: 15,
    backgroundColor: '#ffffff',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#1d1d1d',
  }
});
