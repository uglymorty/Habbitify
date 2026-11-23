import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddHabitModal from "../../../components/AddHabitModal";
import CalendarModal from "../../../components/CalendarModal";
import HomeHeader from "../../../components/HomeHeader";
import ListEmptyComponent from "../../../components/ListEmptyComponent";
import SemiCircleProgress from "../../../components/SemiCircleProgress";
import SwipeableHabitCard from "../../../components/SwipeableHabitCard";
import categories from "../../../constants/categories";
import type { Frequency, Habit } from "../../../types/habit";
import { useAuth } from "../../context/AuthContext";
import { useHabits } from "../../context/HabitsContext";

type AccountProfile = {
  firstName: string;
  lastName: string;
  photoUri: string | null;
};

const account: AccountProfile = {
  firstName: "Name",
  lastName: "Surname",
  photoUri: null,
};

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function Index() {
  const { logout } = useAuth();
  const context = useHabits();
  console.log("Habit context:", context);
  const { habits, addHabit, updateHabit, deleteHabit, toggleHabit } = context;
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitDescription, setNewHabitDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [monthOfYear, setMonthOfYear] = useState(1);
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const selectedDateKey = getDateKey(selectedDate);
  const selectedDateLabel = selectedDate.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const moveSelectedDate = (amount: number) => {
    setSelectedDate(
      (date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount),
    );
  };
  const openCalendar = () => {
    setCalendarMonth(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    );

    setCalendarVisible(true);
  };
  const openAddHabitModal = () => {
    setNewHabitName("");
    setNewHabitDescription("");
    setSelectedCategory("");

    setEditingHabitId(null);

    setFrequency("daily");
    setSelectedDays([]);
    setDayOfMonth(1);
    setMonthOfYear(1);

    setAddModalVisible(true);
  };
  const handleSaveHabit = async () => {
    const trimmedName = newHabitName.trim();

    if (trimmedName === "") {
      Alert.alert("Ошибка", "Введите название привычки");
      return;
    }

    if (frequency === "weekly" && selectedDays.length === 0) {
      Alert.alert(
        "Выберите дни",
        "Для еженедельной привычки необходимо выбрать хотя бы один день недели.",
      );
      return;
    }

    try {
      const habitData = {
        name: trimmedName,
        description: newHabitDescription.trim(),
        category: selectedCategory,
        createdAt: selectedDateKey,
        frequency,

        selectedDays,
        dayOfMonth,
        monthOfYear,
      };

      if (editingHabitId !== null) {
        await updateHabit(editingHabitId, habitData);
      } else {
        await addHabit(habitData);
      }

      setNewHabitName("");
      setNewHabitDescription("");
      setSelectedCategory("");

      setFrequency("daily");
      setSelectedDays([]);
      setDayOfMonth(1);
      setMonthOfYear(1);

      setEditingHabitId(null);
      setAddModalVisible(false);
    } catch (error) {
      console.error("Ошибка сохранения привычки:", error);
      Alert.alert("Ошибка", "Не удалось сохранить привычку");
    }
  };
  const isHabitScheduled = (habit: Habit, date: Date) => {
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
  const handleToggleHabit = async (id: number) => {
    try {
      await toggleHabit(id, selectedDateKey);
    } catch (error) {
      console.error("Ошибка изменения отметки:", error);
    }
  };
  const handleDeleteHabit = async (id: number) => {
    try {
      await deleteHabit(id);
    } catch (error) {
      console.error("Ошибка удаления привычки:", error);
    }
  };
  const startEditHabit = (habit: Habit) => {
    setEditingHabitId(habit.id);

    setNewHabitName(habit.name);
    setNewHabitDescription(habit.description ?? "");
    setSelectedCategory(habit.category);

    setFrequency(habit.frequency);
    setSelectedDays(habit.selectedDays ?? []);
    setDayOfMonth(habit.dayOfMonth ?? 1);
    setMonthOfYear(habit.monthOfYear ?? 1);

    setAddModalVisible(true);
  };
  const visibleHabits = habits.filter((habit) => {
    const createdCondition = habit.createdAt <= selectedDateKey;

    const scheduledCondition = isHabitScheduled(habit, selectedDate);

    console.log("Проверка привычки:", {
      id: habit.id,
      name: habit.name,
      frequency: habit.frequency,

      createdAt: habit.createdAt,
      selectedDateKey,

      selectedDays: habit.selectedDays,
      dayOfMonth: habit.dayOfMonth,
      monthOfYear: habit.monthOfYear,

      selectedWeekDay: selectedDate.getDay(),
      selectedDay: selectedDate.getDate(),
      selectedMonth: selectedDate.getMonth() + 1,

      createdCondition,
      scheduledCondition,
    });

    return createdCondition && scheduledCondition;
  });
  const completedCount = visibleHabits.filter((habit) =>
    habit.completedDates.includes(selectedDateKey),
  ).length;
  const progress =
    visibleHabits.length > 0 ? completedCount / visibleHabits.length : 0;

  const progressPercent = Math.round(progress * 100);

  return (
    <LinearGradient colors={["#f9d9d9", "#ebc0c4"]} style={styles.gradient}>
      <View style={styles.pattern} pointerEvents="none" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <HomeHeader
            firstName={account.firstName}
            lastName={account.lastName}
            photoUri={account.photoUri}
            onOpenCalendar={openCalendar}
            onLogout={logout}
          />
          <View style={styles.progressWrap}>
            <SemiCircleProgress
              progress={progress}
              value={progressPercent}
              label="for today"
              caption="Progress"
            />
          </View>
          <View style={styles.dateRow}>
            <Pressable
              onPress={() => moveSelectedDate(-1)}
              accessibilityRole="button"
              accessibilityLabel="Предыдущий день"
              hitSlop={8}
            >
              <Text style={styles.arrow}>{"<"}</Text>
            </Pressable>
            <Pressable onPress={openCalendar} hitSlop={10}>
              <Text style={styles.dateLabel}>{selectedDateLabel}</Text>
            </Pressable>

            <Pressable
              onPress={() => moveSelectedDate(1)}
              accessibilityRole="button"
              accessibilityLabel="Следующий день"
              hitSlop={8}
            >
              <Text style={styles.arrow}>{">"}</Text>
            </Pressable>
          </View>
          <FlatList
            data={visibleHabits}
            keyExtractor={(habit) => String(habit.id)}
            style={styles.list}
            renderItem={({ item: habit }) => (
              <SwipeableHabitCard
                habit={habit}
                checked={habit.completedDates.includes(selectedDateKey)}
                onToggle={handleToggleHabit}
                onDelete={handleDeleteHabit}
                onEdit={startEditHabit}
                onPressDetails={() =>
                  router.push({
                    pathname: "/habit/[id]",
                    params: { id: String(habit.id) },
                  })
                }
              />
            )}
            ListEmptyComponent={
              <ListEmptyComponent onAddHabit={openAddHabitModal} />
            }
            showsVerticalScrollIndicator={false}
            scrollEnabled={visibleHabits.length > 0}
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
        frequency={frequency}
        selectedDays={selectedDays}
        dayOfMonth={dayOfMonth}
        monthOfYear={monthOfYear}
        onChangeName={setNewHabitName}
        onChangeCategory={setSelectedCategory}
        onChangeFrequency={setFrequency}
        onChangeSelectedDays={setSelectedDays}
        onChangeDayOfMonth={setDayOfMonth}
        onChangeMonthOfYear={setMonthOfYear}
        onAdd={handleSaveHabit}
        onCancel={() => setAddModalVisible(false)}
        isEditing={editingHabitId !== null}
        description={newHabitDescription}
        onChangeDescription={setNewHabitDescription}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    position: "relative",
  },

  pattern: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(255,255,255,0.08)",
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
    position: "relative",
  },

  progressWrap: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 12,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  arrow: {
    fontSize: 28,
    color: "#1c1c1c",
    lineHeight: 28,
    fontWeight: "300",
    opacity: 0.8,
  },

  dateLabel: {
    fontSize: 20,
    color: "#1b1b1b",
    fontWeight: "600",
    letterSpacing: 0.2,
    textTransform: "capitalize",
  },

  list: {
    marginTop: 8,
  },

  fab: {
    position: "absolute",
    right: 30,
    bottom: 22,
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#d9655c",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 6,
  },

  fabText: {
    color: "#fff",
    fontSize: 52,
    lineHeight: 55,
    fontWeight: "300",
  },
});
