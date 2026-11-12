import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type CheckMarkerProps = {
  checked: boolean;
  onPress: () => void;
};

export default function CheckMarker({ checked, onPress }: CheckMarkerProps) {
  console.log('3. CheckMarker:', checked);
  return (
    <Pressable
      onPress={onPress}
      style={checked ? styles.checkFilled: styles.checkEmpty}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel="Отметить привычку выполненной"
    >
      {checked ? <Text style={styles.checkMark}>✓</Text>: null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  checkEmpty: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(28,28,28,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkFilled: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1d1d1d',
    borderWidth: 1.5,
    borderColor: '#1d1d1d',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkMark: {
    color: '#f6dfe1',
    fontSize: 16,
    fontWeight: '700',
  },
});