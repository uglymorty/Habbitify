import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';

import {
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { Frequency } from '../types/habit';

type Category = {
  label: string;
  value: string;
};

type Option = {
  label: string;
  value: number;
};

type AddHabitModalProps = {
  visible: boolean;
  habitName: string;
  selectedCategory: string;
  categories: Category[];

  frequency: Frequency;
  selectedDays: number[];
  dayOfMonth: number;
  monthOfYear: number;

  onChangeName: (name: string) => void;
  onChangeCategory: (category: string) => void;
  onChangeFrequency: (frequency: Frequency) => void;
  onChangeSelectedDays: (days: number[]) => void;
  onChangeDayOfMonth: (day: number) => void;
  onChangeMonthOfYear: (month: number) => void;

  onAdd: () => void;
  onCancel: () => void;
  isEditing: boolean;
  description: string;
  onChangeDescription: (description: string) => void;
};

const frequencyOptions = [
  { label: 'Каждый день', value: 'daily' },
  { label: 'Каждую неделю', value: 'weekly' },
  { label: 'Каждый месяц', value: 'monthly' },
  { label: 'Каждый год', value: 'yearly' },
];

const weekdays = [
  { label: 'Пн', value: 1 },
  { label: 'Вт', value: 2 },
  { label: 'Ср', value: 3 },
  { label: 'Чт', value: 4 },
  { label: 'Пт', value: 5 },
  { label: 'Сб', value: 6 },
  { label: 'Вс', value: 0 },
];

const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
].map((label, index) => ({
  label,
  value: index + 1,
}));

const days: Option[] = Array.from({ length: 31 }, (_, index) => ({
  label: String(index + 1),
  value: index + 1,
}));

export default function AddHabitModal({
  visible,
  habitName,
  selectedCategory,
  categories,
  frequency,
  selectedDays,
  dayOfMonth,
  monthOfYear,
  onChangeName,
  onChangeCategory,
  onChangeFrequency,
  onChangeSelectedDays,
  onChangeDayOfMonth,
  onChangeMonthOfYear,
  onAdd,
  onCancel,
  isEditing,
  description,
  onChangeDescription,
}: AddHabitModalProps) {
  const toggleWeekday = (day: number) => {
    if (selectedDays.includes(day)) {
      onChangeSelectedDays(
        selectedDays.filter((item) => item !== day)
      );
    } else {
      onChangeSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        style={styles.modalBackdrop}
        onPress={Keyboard.dismiss}
      >
        <View style={styles.backgroundModal}>
          <Text style={styles.addModalTitle}>
            {isEditing ? 'Редактировать привычку' : 'Новая привычка'}
          </Text>

          {/* Название привычки */}

          <TextInput
            placeholder="Введите привычку"
            placeholderTextColor="#999"
            value={habitName}
            onChangeText={onChangeName}
            style={styles.habitInput}
          />

          <TextInput
            placeholder="Добавьте описание привычки"
            placeholderTextColor="#999"
            value={description}
            onChangeText={onChangeDescription}
            style={[styles.habitInput, styles.descriptionInput]}
            multiline
            textAlignVertical="top"
          />

          {/* Категория */}

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={categories}
            labelField="label"
            valueField="value"
            placeholder="Выберите категорию"
            value={selectedCategory}
            onChange={(item) => onChangeCategory(item.value)}
          />

          {/* Периодичность */}

          <Text style={styles.fieldTitle}>Периодичность</Text>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={frequencyOptions}
            labelField="label"
            valueField="value"
            placeholder="Выберите периодичность"
            value={frequency}
            onChange={(item) =>
              onChangeFrequency(item.value as Frequency)
            }
          />

          {/* Выбор дней недели */}

          {frequency === 'weekly' && (
            <View style={styles.frequencySection}>
              <Text style={styles.fieldTitle}>
                Выберите дни недели
              </Text>

              <View style={styles.weekdaysContainer}>
                {weekdays.map((day) => {
                  const isSelected = selectedDays.includes(day.value);

                  return (
                    <Pressable
                      key={day.value}
                      style={[
                        styles.weekdayButton,
                        isSelected && styles.weekdayButtonActive,
                      ]}
                      onPress={() => toggleWeekday(day.value)}
                    >
                      <Text
                        style={[
                          styles.weekdayText,
                          isSelected && styles.weekdayTextActive,
                        ]}
                      >
                        {day.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Выбор числа месяца */}

          {frequency === 'monthly' && (
            <View style={styles.frequencySection}>
              <Text style={styles.fieldTitle}>
                Число месяца
              </Text>

              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={days}
                labelField="label"
                valueField="value"
                placeholder="Выберите число"
                value={dayOfMonth}
                onChange={(item) => onChangeDayOfMonth(item.value)}
              />
            </View>
          )}

          {/* Выбор месяца и числа для ежегодной привычки */}

          {frequency === 'yearly' && (
            <View style={styles.frequencySection}>
              <Text style={styles.fieldTitle}>Месяц</Text>

              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={months}
                labelField="label"
                valueField="value"
                placeholder="Выберите месяц"
                value={monthOfYear}
                onChange={(item) => onChangeMonthOfYear(item.value)}
              />

              <Text style={styles.fieldTitle}>Число</Text>

              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={days}
                labelField="label"
                valueField="value"
                placeholder="Выберите число"
                value={dayOfMonth}
                onChange={(item) => onChangeDayOfMonth(item.value)}
              />
            </View>
          )}

          {/* Кнопки */}

          <View style={styles.addModalButtons}>
            <Pressable
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </Pressable>

            <Pressable
              style={styles.addButton}
              onPress={onAdd}
            >
              <Text style={styles.addButtonText}>
                {isEditing ? 'Сохранить' : 'Добавить'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
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
    maxHeight: '90%',
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#fff7f6',
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

  fieldTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#803f3b',
    marginTop: 15,
    marginBottom: 8,
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
  },

  frequencySection: {
    marginTop: 5,
  },

  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },

  weekdayButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f0dddd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  weekdayButtonActive: {
    backgroundColor: '#d9655c',
  },

  weekdayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#803f3b',
  },

  weekdayTextActive: {
    color: '#ffffff',
  },

  addModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#f0dddd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    color: '#803f3b',
    fontSize: 15,
    fontWeight: '600',
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
    fontWeight: '600',
  },
  descriptionInput: {
  height: 90,
  paddingTop: 14,
  marginTop: 14,
},
});