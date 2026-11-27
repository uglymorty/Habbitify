import { NativeTabs } from "expo-router/native-tabs";
import React from "react";
import { Platform } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function TabLayout() {
  const { colors, darkTheme } = useTheme();

  return (
    <NativeTabs
      tintColor={Platform.OS === "android" ? colors.accent : "#F4D5D5"}
      {...(Platform.OS === "android"
        ? {
            backgroundColor: colors.background,
            indicatorColor: darkTheme ? "#171318" : "#FBE5E5",
            labelStyle: {
              fontSize: 14,
              fontWeight: "600" as const,
            },
          }
        : {})}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Дом</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md="home"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="statistics">
        <NativeTabs.Trigger.Label>Статистика</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "chart.bar", selected: "chart.bar.fill" }}
          md="bar_chart"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Настройки</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md="settings"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
