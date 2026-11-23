import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type HomeHeaderProps = {
  firstName: string;
  lastName: string;
  photoUri: string | null;
  onOpenCalendar: () => void;
  onLogout: () => void;
};

export default function HomeHeader({
  firstName,
  lastName,
  photoUri,
  onOpenCalendar,
  onLogout,
}: HomeHeaderProps) {
  const [hasPhotoLoadError, setHasPhotoLoadError] = useState(false);
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

  return (
    <>
      <View style={styles.header}>
        {/* Аватар пользователя */}
        <Pressable
          onPress={() => setProfileVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Открыть профиль"
        >
          <GlassView
            style={styles.avatar}
            glassEffectStyle="clear"
            isInteractive
          >
            {photoUri && !hasPhotoLoadError ? (
              <Image
                source={{ uri: photoUri }}
                style={styles.avatarImage}
                contentFit="cover"
                accessibilityLabel={fullName}
                onError={() => setHasPhotoLoadError(true)}
              />
            ) : (
              <Text style={styles.avatarInitials}>{initials}</Text>
            )}
          </GlassView>
        </Pressable>

        {/* Календарь */}
        <Pressable
          style={styles.calendarButton}
          onPress={onOpenCalendar}
          accessibilityRole="button"
          accessibilityLabel="Открыть календарь"
        >
          <GlassView
            style={styles.calendarButtonGlass}
            glassEffectStyle="clear"
            isInteractive
          >
            <Ionicons name="calendar-outline" size={24} color="#1d1d1d" />
          </GlassView>
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
          <GlassView
            style={styles.profileSheet}
            glassEffectStyle="regular"
            isInteractive
          >
            <View style={styles.dragIndicator} />

            <View style={styles.profileHeader}>
              <Text style={styles.profileName}>
                {fullName || "Пользователь"}
              </Text>

              <Pressable onPress={() => setProfileVisible(false)} hitSlop={12}>
                <Ionicons name="close" size={25} color="#8b7777" />
              </Pressable>
            </View>

            <View style={styles.divider} />

            {/* Выход из аккаунта */}
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={21} color="#d9655c" />

              <Text style={styles.logoutText}>Выйти из аккаунта</Text>
            </Pressable>
          </GlassView>
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
    backgroundColor: "#fff7f6",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 38,
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
