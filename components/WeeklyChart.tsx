import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type WeeklyDataItem = {
  day: string;
  value: number | null;
};

type WeeklyChartProps = {
  data: WeeklyDataItem[];
};

export default function WeeklyChart({ data }: WeeklyChartProps) {
  const { colors } = useTheme();

  const axisValues = [100, 80, 60, 40, 20, 0];

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartContent}>
        <View style={styles.yAxis}>
          {axisValues.map((value) => (
            <Text
              key={value}
              style={[styles.axisLabel, { color: colors.secondaryText }]}
            >
              {value}%
            </Text>
          ))}
        </View>

        <View style={[styles.chartBars, { borderBottomColor: colors.border }]}>
          {axisValues.map((value) => (
            <View
              key={value}
              style={[
                styles.gridLine,
                {
                  top: `${100 - value}%`,
                  borderColor: colors.border,
                },
              ]}
            />
          ))}

          {data.map((item, index) => (
            <ChartBar
              key={index}
              day={item.day}
              value={item.value}
              secondaryText={colors.secondaryText}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

function ChartBar({
  day,
  value,
  secondaryText,
}: {
  day: string;
  value: number | null;
  secondaryText: string;
}) {
  return (
    <View style={styles.barColumn}>
      <View style={styles.barArea}>
        {value !== null && (
          <LinearGradient
            colors={["#d9655c", "#b68080"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[
              styles.bar,
              {
                height: `${Math.max(value, 2)}%`,
              },
            ]}
          />
        )}
      </View>

      <Text style={[styles.dayLabel, { color: secondaryText }]}>{day}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 10,
    borderRadius: 3,
  },

  chartContent: {
    flexDirection: "row",
    height: 145,
  },

  yAxis: {
    width: 30,
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 0,
  },

  axisLabel: {
    fontSize: 8,
  },

  chartBars: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    position: "relative",
    borderBottomWidth: 1,
  },

  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: "dotted",
  },

  barColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 1,
  },

  barArea: {
    width: "65%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  bar: {
    width: "100%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    minHeight: 2,
  },

  dayLabel: {
    position: "absolute",
    bottom: -17,
    fontSize: 9,
  },
});
