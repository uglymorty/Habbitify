import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../src/context/ThemeContext";
import AdaptiveGlassView from "./AdaptiveLiquidGlassView";

type HomeHeaderProps = {
  firstName: string;
  lastName: string;
  onOpenCalendar: () => void;
  onLogout: () => void;
};

export default function HomeHeader({
  firstName,
  lastName,
  onOpenCalendar,
  onLogout,
}: HomeHeaderProps) {
  const { colors, darkTheme } = useTheme();
  const [profileVisible, setProfileVisible] = useState(false);

  const initials =
    `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toLocaleUpperCase(
      "ru-RU",
    );

  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

  const handleLogout = () => {
    setProfileVisible(false);
    onLogout();
  };
  const profileContent = (
    <>
      <View
        style={[styles.dragIndicator, { backgroundColor: colors.border }]}
      />

      <View style={styles.profileHeader}>
        <Text style={[styles.profileName, { color: colors.text }]}>
          {fullName || "Пользователь"}
        </Text>

        <Pressable onPress={() => setProfileVisible(false)} hitSlop={12}>
          <Ionicons name="close" size={25} color={colors.secondaryText} />
        </Pressable>
      </View>

      <View
        style={[
          styles.divider,
          {
            backgroundColor: darkTheme ? "#665563" : "#d9baba",
          },
        ]}
      />

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={21} color={colors.accent} />

        <Text style={[styles.logoutText, { color: colors.accent }]}>
          Выйти из аккаунта
        </Text>
      </Pressable>
    </>
  );

  return (
    <>
      <View style={styles.header}>
        {/* Аватар пользователя */}
        <Pressable
          onPress={() => setProfileVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Открыть профиль"
        >
          <AdaptiveGlassView
            style={[styles.avatar, { borderColor: colors.border }]}
            glassEffectStyle="clear"
            isInteractive
          >
            <Text style={[styles.avatarInitials, { color: colors.text }]}>
              {initials}
            </Text>
          </AdaptiveGlassView>
        </Pressable>

        {/* Календарь */}
        <Pressable
          style={styles.calendarButton}
          onPress={onOpenCalendar}
          accessibilityRole="button"
          accessibilityLabel="Открыть календарь"
        >
          <AdaptiveGlassView
            style={[styles.calendarButtonGlass, { borderColor: colors.border }]}
            glassEffectStyle="clear"
            isInteractive
          >
            <Ionicons name="calendar-outline" size={24} color={colors.text} />
          </AdaptiveGlassView>
        </Pressable>
      </View>

      {/* Нижнее окно профиля */}
      <Modal
        visible={profileVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setProfileVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Затемнение фона */}
          <Pressable
            style={styles.overlay}
            onPress={() => setProfileVisible(false)}
          />

          {/* Нижняя панель */}
          <AdaptiveGlassView
            style={[
              styles.profileSheet,
              {
                borderColor: colors.border,
              },
            ]}
            androidStyle={{
              ...styles.androidProfileSheet,
              backgroundColor: colors.card,
            }}
            glassEffectStyle="regular"
            isInteractive
          >
            {profileContent}
          </AdaptiveGlassView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarInitials: {
    color: "#1d1d1d",
    fontSize: 18,
    fontWeight: "700",
  },

  calendarButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
  },

  calendarButtonGlass: {
    width: "100%",
    height: "100%",
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  profileSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 38,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },

  androidProfileSheet: {
    backgroundColor: "rgba(255,247,246,0.94)",
  },

  dragIndicator: {
    width: 42,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#d9caca",
    alignSelf: "center",
    marginBottom: 24,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  profileName: {
    fontSize: 23,
    fontWeight: "700",
    color: "#ffffff",
  },

  divider: {
    height: 1,
    backgroundColor: "#eadede",
    marginTop: 20,
    marginBottom: 12,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d9655c",
  },
});
