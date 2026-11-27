import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type HomeDateSelectorProps = {
  dateLabel: string;
  textColor: string;
  onPrevious: () => void;
  onNext: () => void;
  onOpenCalendar: () => void;
};

export default function HomeDateSelector({
  dateLabel,
  textColor,
  onPrevious,
  onNext,
  onOpenCalendar,
}: HomeDateSelectorProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPrevious}
        accessibilityRole="button"
        accessibilityLabel="Предыдущий день"
        hitSlop={8}
      >
        <Text style={[styles.arrow, { color: textColor }]}>{"<"}</Text>
      </Pressable>

      <Pressable onPress={onOpenCalendar} hitSlop={10}>
        <Text style={[styles.dateLabel, { color: textColor }]}>
          {dateLabel}
        </Text>
      </Pressable>

      <Pressable
        onPress={onNext}
        accessibilityRole="button"
        accessibilityLabel="Следующий день"
        hitSlop={8}
      >
        <Text style={[styles.arrow, { color: textColor }]}>{">"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  arrow: {
    fontSize: 28,
    lineHeight: 28,
    fontWeight: "300",
    opacity: 0.8,
  },
  dateLabel: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
    textTransform: "capitalize",
  },
});
