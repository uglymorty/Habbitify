import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useSQLiteContext } from 'expo-sqlite';

export default function ExportDatabaseButton() {
  const db = useSQLiteContext();
  const [exporting, setExporting] = useState(false);

  const exportDatabase = async () => {
    try {
      setExporting(true);

      // Проверяем возможность отправки файлов
      const available = await Sharing.isAvailableAsync();

      if (!available) {
        Alert.alert('Ошибка', 'Отправка файлов недоступна');
        return;
      }

      // Получаем содержимое рабочей базы данных
      const databaseBytes = await db.serializeAsync('main');

      // Создаём файл в папке приложения
      const exportFile = new File(
        Paths.cache,
        'Habitify-export.db'
      );

      // Записываем данные SQLite в файл
      await exportFile.write(databaseBytes);

      // Проверяем, что файл создан
      if (!exportFile.exists) {
        throw new Error('Файл экспорта не был создан');
      }

      console.log('Файл базы данных:', exportFile.uri);
      console.log('Размер файла:', exportFile.size);

      // Открываем меню отправки iPhone
      await Sharing.shareAsync(exportFile.uri, {
        mimeType: 'application/x-sqlite3',
        dialogTitle: 'Экспорт базы данных Habitify',
      });

    } catch (error) {
      console.error('Ошибка экспорта БД:', error);

      Alert.alert(
        'Ошибка экспорта',
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <Pressable
      style={styles.button}
      onPress={exportDatabase}
      disabled={exporting}
    >
      <Text style={styles.buttonText}>
        {exporting
          ? 'Подготовка базы...'
          : 'Экспортировать базу данных'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#b68080',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});