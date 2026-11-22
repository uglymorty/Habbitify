import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HabitsProvider } from '../context/HabitsContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HabitsProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="habit/[id]"
            options={{ headerShown: false }}
          />
        </Stack>
      </HabitsProvider>
    </GestureHandlerRootView>
  );
}