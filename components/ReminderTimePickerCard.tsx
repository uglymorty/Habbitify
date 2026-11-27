import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../src/context/ThemeContext";

type ReminderTimePickerCardProps = {
  value: Date;
  darkTheme: boolean;
  onChange: (event: any, date?: Date) => void;
  onDone: () => void;
};

export default function ReminderTimePickerCard({
  value,
  darkTheme,
  onChange,
  onDone,
}: ReminderTimePickerCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.pickerCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.timeChoice, { color: colors.text }]}>
        Выберите время
      </Text>
      <DateTimePicker
        value={value}
        mode="time"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={onChange}
        themeVariant={darkTheme ? "dark" : "light"}
      />

      {Platform.OS === "ios" && (
        <Pressable
          style={[styles.doneButton, { backgroundColor: colors.accent }]}
          onPress={onDone}
        >
          <Text style={styles.doneButtonText}>Готово</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pickerCard: {
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
  },

  doneButton: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 10,
  },

  doneButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  timeChoice: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
});
