import { StyleSheet, Text, View } from 'react-native';

import { Spacing, Sphynx } from '@/constants/theme';
import { useUserProgress } from '@/hooks/use-user-progress';

export function AppHeader() {
  const { hearts, streak } = useUserProgress();

  return (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        <Text style={styles.logoIcon}>⚛️</Text>
        <Text style={styles.logoText}>Sphynx</Text>
      </View>

      <View style={styles.rightGroup}>
        <View style={styles.pill}>
          <Text style={styles.pillEmoji}>🔥</Text>
          <Text style={styles.pillText}>{streak} Días</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillEmoji}>❤️</Text>
          <Text style={styles.pillText}>{hearts}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    backgroundColor: 'transparent',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  logoIcon: {
    fontSize: 22,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: Sphynx.textDark,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Sphynx.border,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
  },
  pillEmoji: {
    fontSize: 14,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
    color: Sphynx.textDark,
  },
});