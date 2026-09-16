import { StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';

import { RADIO_TARJETA, UI } from '@/constants/theme';

type Props = {
  /** Imagen local, ej. require('@/assets/mascotas/gato-regla.png'). */
  imagen: ImageSourcePropType;
  /** Ancho en px. */
  ancho?: number;
  /** Alto en px. */
  alto?: number;
  /** Muestra marco blanco redondeado con borde (estilo tarjeta). */
  conMarco?: boolean;
  /** Estilo extra del contenedor. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Contenedor de mascotas (gato científico / robot).
 * Consume las imágenes locales de `assets/mascotas/` y las muestra
 * contenidas, con marco blanco redondeado opcional.
 */
export function MascotContainer({ imagen, ancho = 200, alto = 200, conMarco = true, style }: Props) {
  return (
    <View style={[conMarco && styles.marco, { width: ancho, height: alto }, style]}>
      <Image source={imagen} style={styles.imagen} contentFit="contain" transition={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  marco: {
    backgroundColor: UI.tarjeta,
    borderRadius: RADIO_TARJETA,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imagen: {
    flex: 1,
    width: '100%',
    borderRadius: 14,
  },
});