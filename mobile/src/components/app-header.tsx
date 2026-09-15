import { StyleSheet, View } from 'react-native';

import { CatMascot } from '@/components/cat-mascot';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useUserProgress } from '@/hooks/use-user-progress';

export function AppHeader() {
  const { hearts, streak } = useUserProgress();

  return (
    <ThemedView style={styles.header}>
      <View style={styles.pill}>
        <ThemedText style={styles.pillIcon}>🔥</ThemedText>
        <ThemedText type="smallBold" style={styles.pillText}>
          {streak}
        </ThemedText>
      </View>

      <View style={styles.rightGroup}>
        <View style={styles.pill}>
          <ThemedText style={styles.pillIcon}>❤️</ThemedText>
          <ThemedText type="smallBold" style={styles.pillText}>
            {hearts}
          </ThemedText>
        </View>
        <View style={styles.avatar}>
          <CatMascot size={40} />
        </View>
      </View>
    </ThemedView>
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
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: '#FFF3D6',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
  },
  pillIcon: {
    fontSize: 18,
  },
  pillText: {
    color: '#7A5C1E',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    borderRadius: 24,
    backgroundColor: '#F0EDD9',
    padding: 2,
  },
});