
import React from 'react';

import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HabitsProvider } from '../context/HabitsContext';
import { initializeDatabase } from '../database/database';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider
        databaseName="App.db"
        assetSource={{
          assetId: require('../../assets/database/App.db'),
        }}
        onInit={initializeDatabase}
      >
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
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
