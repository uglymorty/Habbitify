import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type WeekSwitcherProps = {
  weekLabel: string;
  isCurrentWeek: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export default function WeekSwitcher({
  weekLabel,
  isCurrentWeek,
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
}: WeekSwitcherProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.weekSwitcher}>
      <Pressable
        onPress={onPrevious}
        disabled={!canGoBack}
        style={styles.weekArrow}
      >
        <Text
          style={[
            styles.arrowText,
            { color: canGoBack ? colors.text : colors.secondaryText },
          ]}
        >
          ‹
        </Text>
      </Pressable>

      <View style={styles.weekTitleWrap}>
        <Text style={[styles.weekTitle, { color: colors.text }]}>
          {weekLabel}
        </Text>

        {isCurrentWeek ? (
          <Text style={[styles.currentWeekLabel, { color: colors.accent }]}>
            Текущая неделя
          </Text>
        ) : null}
      </View>

      <Pressable
        onPress={onNext}
        disabled={!canGoForward}
        style={styles.weekArrow}
      >
        <Text
          style={[
            styles.arrowText,
            { color: canGoForward ? colors.text : colors.secondaryText },
          ]}
        >
          ›
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  weekSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  weekArrow: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  arrowText: {
    fontSize: 32,
    lineHeight: 36,
  },

  weekTitleWrap: {
    flex: 1,
    alignItems: "center",
  },

  weekTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  currentWeekLabel: {
    fontSize: 11,
    marginTop: 3,
  },
});
