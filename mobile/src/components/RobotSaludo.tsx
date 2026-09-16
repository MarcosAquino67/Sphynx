import { useEffect } from 'react';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { MascotContainer } from '@/components/MascotContainer';

type Props = {
  /** Imagen local. Por defecto, el robot saludando. */
  imagen?: ImageSourcePropType;
  ancho?: number;
  alto?: number;
  conMarco?: boolean;
  /** Retardo en ms antes de aparecer (para encadenar animaciones). */
  retardo?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Mascota con saludo animado estilo Duolingo.
 * Aparece con rebote elástico (spring) y luego se inclina de lado a
 * lado simulando el "hola". Úsalo en lugar de <MascotContainer /> o
 * <Image /> cuando quieras que la mascota se mueva al abrir la pantalla.
 */
export function RobotSaludo({
  imagen = require('@/assets/mascotas/robot.jpeg'),
  ancho = 200,
  alto = 200,
  conMarco = true,
  retardo = 0,
  style,
}: Props) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // 1. Entrada con rebote elástico tipo Duolingo
    scale.value = withDelay(retardo, withSpring(1, { damping: 8, stiffness: 90 }));

    // 2. Pequeño saludo justo después de aparecer
    rotation.value = withDelay(
      retardo + 500,
      withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 150 }),
        withTiming(0, { duration: 100 }),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <MascotContainer imagen={imagen} ancho={ancho} alto={alto} conMarco={conMarco} />
    </Animated.View>
  );
}