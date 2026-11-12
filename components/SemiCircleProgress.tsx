import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
type SemiCircleProgressProps = {
  progress: number;
  value: number;
  label: string;
  caption?: string;
};

export default function SemiCircleProgress({
  progress,
  value,
  label,
  caption = '',
}: SemiCircleProgressProps) {
  const width = 300;
  const height = 180;
  const strokeWidth = 22;
  const radius = (width - strokeWidth) / 2;
  const centerY = height - 12;
  const arcLength = Math.PI * radius;
  const progressLength = arcLength * Math.min(Math.max(progress, 0), 1);

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="habit-progress" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#e49e9e" />
            <Stop offset="100%" stopColor="#e76666" />
          </LinearGradient>
        </Defs>

        <Path
          d={`M ${strokeWidth / 2} ${centerY}
              A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${centerY}`}
          stroke="rgba(29, 42, 35, 0.14)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        <Path
          d={`M ${strokeWidth / 2} ${centerY}
              A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${centerY}`}
          stroke="url(#habit-progress)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${arcLength}`}
          strokeDashoffset={arcLength - progressLength}
        />
      </Svg>

      <View style={styles.centerText}>
        {caption ? <Text style={styles.caption}>{caption}</Text> : null}
        <Text style={styles.value}>{value}%</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 190,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerText: {
    position: 'absolute',
    top: 84,
    alignItems: 'center',
  },
  caption: {
    fontSize: 12,
    color: '#1d2a23',
    marginBottom: 2,
    opacity: 0.8,
  },
  value: {
    fontSize: 46,
    lineHeight: 52,
    fontWeight: '700',
    color: '#1d1d1f',
  },
  label: {
    fontSize: 18,
    color: '#232323',
    fontWeight: '500',
    textTransform: 'lowercase',
  },
});