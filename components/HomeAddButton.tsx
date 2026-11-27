import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../src/context/ThemeContext";

type HomeAddButtonProps = {
  onPress: () => void;
};

export default function HomeAddButton({ onPress }: HomeAddButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: colors.accent }]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Text style={styles.fabText}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 30,
    bottom: 22,
    width: 74,
    height: 74,
    borderRadius: 37,
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
