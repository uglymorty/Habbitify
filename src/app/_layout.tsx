import React, { useEffect } from "react";

import { Stack, useRouter, useSegments } from "expo-router";

import { ActivityIndicator, View } from "react-native";

import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider, useAuth } from "../context/AuthContext";
import { HabitsProvider } from "../context/HabitsContext";
import { ThemeProvider } from "../context/ThemeContext";
import { initializeDatabase } from "../database/database";

// Компонент проверки авторизации и маршрутизации
function AuthNavigator() {
  const { user, loading } = useAuth();

  const router = useRouter();
  const segments = useSegments();

  const firstSegment = segments[0];

  const isAuthScreen = firstSegment === "login" || firstSegment === "register";

  useEffect(() => {
    if (loading) return;

    if (!user && !isAuthScreen) {
      router.replace("/login");
    }

    if (user && isAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, loading, isAuthScreen, router]);

  // Пока проверяем авторизацию или выполняем перенаправление
  if (loading || (!user && !isAuthScreen) || (user && isAuthScreen)) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9d9d9",
        }}
      >
        <ActivityIndicator size="large" color="#b68080" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />

      <Stack.Screen name="register" options={{ headerShown: false }} />

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="habit/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider
        databaseName="App.db"
        assetSource={{
          assetId: require("../../assets/database/App.db"),
        }}
        onInit={initializeDatabase}
      >
        <ThemeProvider>
          <AuthProvider>
            <HabitsProvider>
              <AuthNavigator />
            </HabitsProvider>
          </AuthProvider>
        </ThemeProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
