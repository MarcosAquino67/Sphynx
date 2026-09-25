import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing, UI } from '@/constants/theme';
import { useIdioma } from '@/context/IdiomaContext';

export function SelectorIdioma({ compact = false }: { compact?: boolean }) {
  const { idioma, setIdioma } = useIdioma();

  return (
    <View style={[styles.fila, compact && styles.compactFila]}>
      <Pressable
        onPress={() => setIdioma('es')}
        style={[styles.pill, idioma === 'es' && styles.pillActivo]}>
        <Text style={styles.flag}>🇪🇸</Text>
        <Text style={[styles.texto, idioma === 'es' && styles.textoActivo]}>Español</Text>
      </Pressable>
      <Pressable
        onPress={() => setIdioma('jopara')}
        style={[styles.pill, idioma === 'jopara' && styles.pillActivo]}>
        <Text style={styles.flag}>🇵🇾</Text>
        <Text style={[styles.texto, idioma === 'jopara' && styles.textoActivo]}>Jopara</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'center',
    marginTop: Spacing.two,
  },
  compactFila: {
    marginTop: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pillActivo: {
    borderColor: UI.azul,
    backgroundColor: '#EFF6FF',
  },
  flag: {
    fontSize: 16,
  },
  texto: {
    fontSize: 14,
    fontWeight: '800',
    color: UI.texto,
  },
  textoActivo: {
    color: UI.azulOscuro,
  },
});
