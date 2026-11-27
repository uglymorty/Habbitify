import React, { type ReactNode } from "react";
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { GlassView } from "expo-glass-effect";
import { useTheme } from "../src/context/ThemeContext";

type AdaptiveGlassViewProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  androidStyle?: StyleProp<ViewStyle>;
  glassEffectStyle?: "regular" | "clear" | "none";
  isInteractive?: boolean;
};

export default function AdaptiveGlassView({
  children,
  style,
  androidStyle,
  glassEffectStyle = "regular",
  isInteractive = false,
}: AdaptiveGlassViewProps) {
  const { colors } = useTheme();

  if (Platform.OS === "ios") {
    return (
      <GlassView
        style={style}
        glassEffectStyle={glassEffectStyle}
        isInteractive={isInteractive}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View
      style={[
        styles.androidGlass,
        {
          backgroundColor: colors.glass,
          borderColor: colors.border,
        },
        androidStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  androidGlass: {
    borderWidth: 1,
    overflow: "hidden",
  },
});
