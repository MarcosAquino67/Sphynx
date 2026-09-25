import { Pressable, StyleSheet, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { UI } from '@/constants/theme';
import { playClic } from '@/services/sonidos';
import type { IconoMCI } from '@/data/unidades';

type Props = {
  /** Texto del botón. */
  titulo: string;
  /** Acción al presionar. */
  onPress?: () => void;
  /** Color de la cara del botón (usa UI.*). */
  color?: string;
  /** Color del borde inferior grueso (efecto 3D). Debe ser más oscuro que `color`. */
  colorBorde?: string;
  /** Icono vectorial opcional a la izquierda del texto. */
  icono?: IconoMCI;
  /** Tamaño del icono. */
  tamanoIcono?: number;
  /** Estilo extra del contenedor. */
  style?: StyleProp<ViewStyle>;
  /** Estilo extra del texto. */
  textStyle?: StyleProp<TextStyle>;
  /** Deshabilita el botón (se atenúa y no responde). */
  deshabilitado?: boolean;
};

/**
 * Botón 3D estilo "chunky" (mockups Sphynx).
 * El volumen se logra con un borde inferior grueso (`borderBottomWidth: 6`)
 * de un tono más oscuro; al presionar, el borde se achica y el botón "baja".
 */
export function Button3D({
  titulo,
  onPress,
  color = UI.naranja,
  colorBorde = UI.naranjaOscuro,
  icono,
  tamanoIcono = 22,
  style,
  textStyle,
  deshabilitado = false,
}: Props) {
  return (
    <Pressable
      onPress={() => {
        playClic();
        onPress?.();
      }}
      disabled={deshabilitado}
      style={({ pressed }) => [
        styles.boton,
        {
          backgroundColor: color,
          borderColor: colorBorde,
          // Efecto 3D: el borde inferior se comprime al presionar
          borderBottomWidth: pressed ? 2 : 6,
          transform: pressed ? [{ translateY: 3 }] : [],
          opacity: deshabilitado ? 0.6 : 1,
        },
        style,
      ]}>
      {icono && (
        <MaterialCommunityIcons name={icono} size={tamanoIcono} color="#FFFFFF" style={styles.icono} />
      )}
      <Text style={[styles.texto, textStyle]}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 20,
    // Sombra suave debajo del botón
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  icono: {
    marginRight: 8,
  },
  texto: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});