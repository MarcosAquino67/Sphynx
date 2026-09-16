import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { UI } from '@/constants/theme';

export type EstadoNivel = 'bloqueado' | 'activo' | 'completado';

type Props = {
  /** Número del nivel (se muestra como "Niv. N"). */
  nivel: number;
  /** Estado visual del nodo. */
  estado?: EstadoNivel;
  /** Nombre corto del tema (se muestra debajo, opcional). */
  etiqueta?: string;
  /** Diámetro del nodo en px. */
  tamano?: number;
  /** Acción al tocar el nodo. */
  onPress?: () => void;
};

/**
 * Nodo metálico redondo del mapa de niveles (mockups Sphynx).
 * - bloqueado: gris metálico con candado.
 * - activo: anillo degradado azul/violeta con estrella iluminada + resplandor.
 * - completado: verde metálico con tilde.
 */
export function LevelNode({ nivel, estado = 'bloqueado', etiqueta, tamano = 76, onPress }: Props) {
  const esActivo = estado === 'activo';
  const esCompletado = estado === 'completado';

  // Colores del degradado según estado (efecto metálico / iluminado)
  const colores: [string, string] = esActivo
    ? ['#8E63D6', UI.azul]
    : esCompletado
      ? [UI.verde, UI.verdeOscuro]
      : [UI.metalClaro, UI.metal];

  const borde = esActivo ? UI.moradoOscuro : esCompletado ? UI.verdeOscuro : UI.metalOscuro;

  return (
    <View style={styles.wrap}>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Nivel ${nivel}`}>
        <LinearGradient
          colors={colores}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.anillo,
            {
              width: tamano,
              height: tamano,
              borderRadius: tamano / 2,
              borderColor: borde,
            },
            esActivo && styles.resplandor,
          ]}>
          <View
            style={[
              styles.centro,
              {
                width: tamano - 18,
                height: tamano - 18,
                borderRadius: (tamano - 18) / 2,
              },
            ]}>
            {esActivo && <MaterialCommunityIcons name="star" size={30} color={UI.estrella} />}
            {esCompletado && <MaterialCommunityIcons name="check" size={30} color="#FFFFFF" />}
            {estado === 'bloqueado' && (
              <MaterialCommunityIcons name="lock" size={28} color="#6B7683" />
            )}
          </View>
        </LinearGradient>
      </Pressable>
      <Text style={styles.nivel}>Niv. {nivel}</Text>
      {etiqueta ? <Text style={styles.etiqueta}>{etiqueta}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  anillo: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra suave del nodo
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  resplandor: {
    shadowColor: UI.azul,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  centro: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nivel: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '800',
    color: UI.texto,
  },
  etiqueta: {
    fontSize: 11,
    color: UI.textoSuave,
    textAlign: 'center',
    maxWidth: 90,
  },
});