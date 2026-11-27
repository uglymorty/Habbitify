import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddHabitModal from "../../../components/AddHabitModal";
import CalendarModal from "../../../components/CalendarModal";
import HomeAddButton from "../../../components/HomeAddButton";
import HomeDateSelector from "../../../components/HomeDateSelector";
import HomeHabitsList from "../../../components/HomeHabitsList";
import HomeHeader from "../../../components/HomeHeader";
import SemiCircleProgress from "../../../components/SemiCircleProgress";
import categories from "../../../constants/categories";
import type { Frequency, Habit } from "../../../types/habit";
import { useAuth } from "../../context/AuthContext";
import { useHabits } from "../../context/HabitsContext";
import { useTheme } from "../../context/ThemeContext";
import { getDateKey } from "../../utils/dateUtils";
import { isHabitScheduled } from "../../utils/habitSchedule";
import { getHabitStatistics } from "../../utils/habitStatistics";

export default function Index() {
  const { user, logout } = useAuth();
  const { darkTheme, colors } = useTheme();
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
  const { completedCount, progress, progressPercent } = getHabitStatistics(
    visibleHabits,
    selectedDateKey,
  );
  return (
    <LinearGradient
      colors={[colors.background, colors.background]}
      style={styles.gradient}
    >
      <View
        style={[
          styles.pattern,
          {
            backgroundColor: darkTheme
              ? "rgba(255,255,255,0.025)"
              : "rgba(255,255,255,0.08)",
          },
        ]}
        pointerEvents="none"
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <HomeHeader
            firstName={user?.name ?? ""}
            lastName={user?.surname ?? ""}
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
          <HomeDateSelector
            dateLabel={selectedDateLabel}
            textColor={colors.text}
            onPrevious={() => moveSelectedDate(-1)}
            onNext={() => moveSelectedDate(1)}
            onOpenCalendar={openCalendar}
          />
          <HomeHabitsList
            habits={visibleHabits}
            selectedDateKey={selectedDateKey}
            onToggle={handleToggleHabit}
            onDelete={handleDeleteHabit}
            onEdit={startEditHabit}
            onPressDetails={(habit) =>
              router.push({
                pathname: "/habit/[id]",
                params: { id: String(habit.id) },
              })
            }
            onAddHabit={openAddHabitModal}
          />
          <HomeAddButton onPress={openAddHabitModal} />
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
});
