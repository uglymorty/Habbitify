import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../src/context/ThemeContext";

type ReminderTimeCardProps = {
  title: string;
  description: string;
  time: string;
  onPress: () => void;
};

export default function ReminderTimeCard({
  title,
  description,
  time,
  onPress,
}: ReminderTimeCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.settingCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {title}
        </Text>

        <Text
          style={[styles.settingDescription, { color: colors.secondaryText }]}
        >
          {description}
        </Text>
      </View>

      <Pressable
        style={[styles.timeButton, { backgroundColor: colors.cardSecondary }]}
        onPress={onPress}
      >
        <Ionicons name="time-outline" size={16} color={colors.icon} />

        <Text style={[styles.timeText, { color: colors.text }]}>{time}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  settingCard: {
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderWidth: 1,
  },

  settingInfo: {
    flex: 1,
    marginRight: 10,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  settingDescription: {
    fontSize: 11,
    marginTop: 4,
  },

  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },

  timeText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
