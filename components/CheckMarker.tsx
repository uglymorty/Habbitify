import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../src/context/ThemeContext";

type CheckMarkerProps = {
  checked: boolean;
  onPress: () => void;
};

export default function CheckMarker({ checked, onPress }: CheckMarkerProps) {
  const { darkTheme, colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.check,
        {
          backgroundColor: checked
            ? darkTheme
              ? colors.accent
              : "#1d1d1d"
            : darkTheme
              ? "rgba(255,255,255,0.06)"
              : "rgba(255,255,255,0.18)",

          borderColor: checked
            ? darkTheme
              ? colors.accent
              : "#1d1d1d"
            : colors.border,
        },
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel="Отметить привычку выполненной"
    >
      {checked ? (
        <Text
          style={[
            styles.checkMark,
            {
              color: darkTheme ? "#FFFFFF" : "#f6dfe1",
            },
          ]}
        >
          ✓
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  checkMark: {
    fontSize: 16,
    fontWeight: "700",
  },
});
