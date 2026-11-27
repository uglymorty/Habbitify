import { Ionicons } from "@expo/vector-icons";
import React, { type ComponentProps } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import { useTheme } from "../src/context/ThemeContext";

type SettingsSwitchCardProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  trackColorFalse?: string;
  thumbColor?: string;
};

export default function SettingsSwitchCard({
  icon,
  title,
  description,
  value,
  onValueChange,
  disabled = false,
  trackColorFalse = "#e0c5c5",
  thumbColor = "#ffffff",
}: SettingsSwitchCardProps) {
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
        <View style={styles.settingHeader}>
          <Ionicons name={icon} size={22} color={colors.icon} />

          <View style={styles.textContainer}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              {title}
            </Text>

            {description && (
              <Text
                style={[
                  styles.settingDescription,
                  { color: colors.secondaryText },
                ]}
              >
                {description}
              </Text>
            )}
          </View>
        </View>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: trackColorFalse,
          true: colors.accent,
        }}
        thumbColor={thumbColor}
        ios_backgroundColor={trackColorFalse}
        disabled={disabled}
      />
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
    marginRight: 12,
  },

  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  textContainer: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  settingDescription: {
    fontSize: 11,
    marginTop: 4,
  },
});
