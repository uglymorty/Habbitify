
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.title}>Настройки</Text>
        <Text style={styles.subtitle}>
          Настрой приложение под себя
        </Text>
        <Text style={styles.sectionTitle}>Внешний вид</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <View style={styles.settingHeader}>
               <Ionicons
               name="moon-outline"
                size={22}
               color="#803f3b"
              />
            <Text style={styles.settingTitle}>
              Тёмная тема
            </Text>
            </View>
          </View>

          <Switch
            value={darkTheme}
            onValueChange={setDarkTheme}
            trackColor={{
              false: '#e0c5c5',
              true: '#d9655c',
            }}
            thumbColor="#ffffff"
          />
        </View>
        <Text style={styles.sectionTitle}>Уведомления</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <View style={styles.settingHeader}>
              <Ionicons
               name="notifications-outline"
               size={22}
               color="#803f3b"
              />
              <Text style={styles.settingTitle}>
                Уведомления
              </Text>
            </View>
          </View>

          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{
              false: '#d69c9c',
              true: '#d9655c',
            }}
            thumbColor="#ffffff"
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4D5D5',
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1d1d1d',
  },

  subtitle: {
    fontSize: 15,
    color: '#795e5e',
    marginTop: 6,
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
    marginTop: 15,
  },

  settingCard: {
    backgroundColor: '#fff7f6',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  settingInfo: {
    flex: 1,
    marginRight: 12,
  },

  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1d',
  },

  settingDescription: {
    fontSize: 13,
    color: '#8d7777',
    marginTop: 5,
  },
  settingHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
});
