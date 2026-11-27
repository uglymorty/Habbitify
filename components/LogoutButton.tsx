import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { useTheme } from "../src/context/ThemeContext";

type LogoutButtonProps = {
  onPress: () => void;
};

export default function LogoutButton({ onPress }: LogoutButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[
        styles.logoutButton,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
    >
      <Ionicons name="log-out-outline" size={20} color={colors.accent} />

      <Text style={[styles.logoutText, { color: colors.accent }]}>
        Выйти из аккаунта
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 15,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
