import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing, Sphynx } from '@/constants/theme';

const TIENDA_ITEMS = [
  { emoji: '❤️', nombre: 'Corazón extra', precio: '100 gemas', color: '#FFE5E5' },
  { emoji: '📖', nombre: 'Lección extra', precio: '50 gemas', color: '#E5F6FF' },
  { emoji: '🧠', nombre: 'Pista de examen', precio: '75 gemas', color: '#FFF3D6' },
];

export default function TiendaScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>
        <ThemedText type="subtitle" style={styles.title}>
          Tienda
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.sub}>
          Gema ha'e champoreỹ gua'u ha'e rectifica peteĩ mba'e
        </ThemedText>

        <View style={styles.gemsRow}>
          <ThemedText style={styles.gemEmoji}>💎</ThemedText>
          <ThemedText type="smallBold">2 540 gemas</ThemedText>
        </View>

        <View style={styles.list}>
          {TIENDA_ITEMS.map((item) => (
            <ThemedView key={item.nombre} type="backgroundElement" style={[styles.card, { backgroundColor: item.color }]}>
              <ThemedText style={styles.cardEmoji}>{item.emoji}</ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText type="smallBold">{item.nombre}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.precio}
                </ThemedText>
              </View>
            </ThemedView>
          ))}
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
  gemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: '#E5F6FF',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.four,
    marginTop: Spacing.five,
  },
  gemEmoji: {
    fontSize: 20,
  },
  list: {
    width: '100%',
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.four,
    gap: Spacing.three,
  },
  cardEmoji: {
    fontSize: 28,
  },
});