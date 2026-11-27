import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type StatisticCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

export default function StatisticCard({
  title,
  value,
  subtitle,
}: StatisticCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>

      <View style={styles.cardValueWrap}>
        <Text style={[styles.cardValue, { color: colors.text }]}>{value}</Text>

        {subtitle ? (
          <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    minHeight: 170,
    borderRadius: 24,
    padding: 16,
  },

  cardTitle: {
    fontSize: 11,
    textAlign: "center",
  },

  cardValueWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  cardValue: {
    fontSize: 27,
    fontWeight: "700",
    textAlign: "center",
  },

  cardSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },
});
