import { Ionicons } from '@expo/vector-icons';
import { GlassView } from 'expo-glass-effect';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type HomeHeaderProps = {
  firstName: string;
  lastName: string;
  photoUri: string | null;
  onOpenCalendar: () => void;
};

export default function HomeHeader({
  firstName,
  lastName,
  photoUri,
  onOpenCalendar,
}: HomeHeaderProps) {
  const [hasPhotoLoadError, setHasPhotoLoadError] = useState(false);

  const initials = `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toLocaleUpperCase('ru-RU');

  return (
    <View style={styles.header}>
      <GlassView style={styles.avatar} glassEffectStyle="clear">
        {photoUri && !hasPhotoLoadError ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.avatarImage}
            contentFit="cover"
            accessibilityLabel={`${firstName} ${lastName}`}
            onError={() => setHasPhotoLoadError(true)}
          />
        ) : (
          <Text style={styles.avatarInitials}>{initials}</Text>
        )}
      </GlassView>

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
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  avatarInitials: {
    color: '#1d1d1d',
    fontSize: 18,
    fontWeight: '700',
  },

  calendarButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
  },

  calendarButtonGlass: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});