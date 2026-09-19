import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';

type Props = {
  /** Título principal, ej. "Unidad Temática 1". */
  titulo: string;
  /** Subtítulo en cursiva, ej. "Tema 1: Movimiento y Fuerzas". */
  subtitulo?: string;
  /** Variante visual: 'tarjeta' (card blanca) o 'simple' (título centrado). */
  variante?: 'tarjeta' | 'simple';
  /** Muestra el enlace "< Atrás" arriba a la izquierda. */
  mostrarAtras?: boolean;
};

/**
 * Cabecera de pantallas de unidad (mockups Sphynx).
 * - 'tarjeta': card blanca redondeada con título + subtítulo.
 * - 'simple': enlace atrás + título centrado ("Tema: X").
 */
export function HeaderUnit({ titulo, subtitulo, variante = 'tarjeta', mostrarAtras = false }: Props) {
  const insets = useSafeAreaInsets();
  const topPad = Math.max(insets.top, 8);

  if (variante === 'simple') {
    return (
      <View style={[styles.simpleWrap, { width: '100%', paddingTop: topPad + Spacing.two }]}>
        {mostrarAtras && (
          <Pressable onPress={() => router.back()} style={[styles.atras, { alignSelf: 'flex-start', marginBottom: Spacing.two }]}>
            <MaterialCommunityIcons name="chevron-left" size={22} color="#FFFFFF" />
            <Text style={styles.atrasTexto}>Atrás</Text>
          </Pressable>
        )}
        <Text style={styles.simpleTitulo}>{titulo}</Text>
        {subtitulo ? <Text style={styles.simpleSubtitulo}>{subtitulo}</Text> : null}
      </View>
    );
  }

  return (
    <View style={{ width: '100%', paddingTop: mostrarAtras ? topPad : 0 }}>
      {mostrarAtras && (
        <Pressable onPress={() => router.back()} style={[styles.atras, styles.atrasMargen]}>
          <MaterialCommunityIcons name="chevron-left" size={22} color="#FFFFFF" />
          <Text style={styles.atrasTexto}>Atrás</Text>
        </Pressable>
      )}
      <View style={styles.tarjeta}>
        <Text style={styles.titulo}>{titulo}</Text>
        {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- Variante tarjeta ---
  tarjeta: {
    backgroundColor: UI.tarjeta,
    borderRadius: RADIO_TARJETA,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '900',
    color: UI.texto,
    textAlign: 'center',
  },
  subtitulo: {
    marginTop: 6,
    fontSize: 14,
    fontStyle: 'italic',
    color: UI.textoSuave,
    textAlign: 'center',
  },
  // --- Variante simple ---
  simpleWrap: {
    width: '100%',
    alignItems: 'center',
  },
  simpleTitulo: {
    fontSize: 24,
    fontWeight: '900',
    color: UI.texto,
    textAlign: 'center',
  },
  simpleSubtitulo: {
    marginTop: 4,
    fontSize: 15,
    color: UI.textoSuave,
    textAlign: 'center',
  },
  // --- Enlace atrás (botón rojo en esquina) ---
  atras: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: UI.rojo,
    borderWidth: 2,
    borderColor: UI.rojoOscuro,
    borderBottomWidth: 4,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  atrasMargen: {
    marginBottom: Spacing.two,
  },
  atrasTexto: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});