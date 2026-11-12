
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import React from 'react';

type ListEmptyComponentProps = {
  onAddHabit: () => void;
};

export default function ListEmptyComponent({
  onAddHabit,
}: ListEmptyComponentProps) {
  return (
    <View style={styles.container}>

      <View style={styles.iconContainer}>
        <Ionicons
          name="book-outline"
          size={52}
          color="#986D6D"
        />
      </View>

      <Text style={styles.title}>
        Пока здесь пусто
      </Text>
      <Text style={styles.description}>
        У тебя пока нет привычек. 
        Нажмите на +, чтобы это исправить.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 45,
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#EBD5D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#604747',
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#987B7B',
    textAlign: 'center',
    marginBottom: 28,
  },


});
