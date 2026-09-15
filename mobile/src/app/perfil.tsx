import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CatMascot } from '@/components/cat-mascot';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';

export default function PerfilScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.avatarContainer}>
          <CatMascot size={120} />
        </View>
        <ThemedText type="title" style={styles.name}>
          Estudiante
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.sub}>
          Ojeve ojeve ha'e ojeve juru ha'e emba'e
        </ThemedText>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <ThemedText type="smallBold">🔥 12</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Rachá
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="smallBold">⭐ 380</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              XP Total
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="smallBold">💎 2 540</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Gemas
            </ThemedText>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  avatarContainer: {
    marginBottom: Spacing.two,
    marginTop: Spacing.four,
  },
  name: {
    textAlign: 'center',
  },
  sub: {
    textAlign: 'center',
    marginTop: Spacing.one,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.five,
    marginTop: Spacing.five,
  },
  statItem: {
    alignItems: 'center',
    gap: Spacing.half,
  },
});