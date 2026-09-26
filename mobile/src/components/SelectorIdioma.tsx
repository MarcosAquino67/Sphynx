import { Pressable, StyleSheet, Text } from 'react-native';

import { Spacing, UI } from '@/constants/theme';
import { useIdioma } from '@/context/IdiomaContext';

/** Un solo botón ES ↔ Jopara (como antes). */
export function SelectorIdioma({ compact = false }: { compact?: boolean }) {
  const { idioma, setIdioma } = useIdioma();

  return (
    <Pressable
      onPress={() => setIdioma(idioma === 'es' ? 'jopara' : 'es')}
      style={[styles.pill, compact && styles.compact]}>
      <Text style={styles.texto}>{idioma === 'es' ? 'ES → JOPARA' : 'JOPARA → ES'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'center',
    marginTop: Spacing.two,
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    borderRadius: 16,
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
  },
  compact: {
    marginTop: 8,
  },
  texto: {
    fontSize: 12,
    fontWeight: '800',
    color: UI.texto,
  },
});
