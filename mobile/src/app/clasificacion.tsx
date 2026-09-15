import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CatMascot } from '@/components/cat-mascot';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';

export default function ClasificacionScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>
        <ThemedText type="subtitle" style={styles.title}>
          Tabla de Clasificación
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.sub}>
          Horageva peteĩ ojeve ojeve ha'e mboy pya'e
        </ThemedText>

        <View style={styles.card}>
          <ThemedText style={styles.trophy}>🏆</ThemedText>
          <ThemedText type="smallBold">Tu Ranking Global</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            #42
          </ThemedText>
        </View>

        <View style={styles.mascotBox}>
          <CatMascot size={64} />
          <ThemedText type="small" themeColor="textSecondary">
            ¡Seguí así y vas a subir de puesto!
          </ThemedText>
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
  title: {
    textAlign: 'center',
  },
  sub: {
    textAlign: 'center',
    marginTop: Spacing.one,
  },
  card: {
    marginTop: Spacing.five,
    width: '100%',
    backgroundColor: '#FFF3D6',
    borderRadius: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  trophy: {
    fontSize: 40,
  },
  mascotBox: {
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
});