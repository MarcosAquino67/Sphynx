import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as NativeSplash from 'expo-splash-screen';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { MascotContainer } from '@/components/MascotContainer';
import { Spacing, UI } from '@/constants/theme';

type Props = {
  /** Se llama cuando termina la animación (~3.2s) para mostrar la app. */
  onFinish: () => void;
};

/**
 * Splash de bienvenida animado (Sphynx + robot saludando).
 * 1. El título entra con fade + caída suave.
 * 2. El robot aparece con rebote elástico.
 * 3. El robot se inclina de lado a lado simulando el saludo.
 * 4. A los ~3.2s llama a `onFinish` para entrar a la app.
 */
export function SplashScreen({ onFinish }: Props) {
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-30);
  const robotScale = useSharedValue(0);
  const robotRotation = useSharedValue(0);

  useEffect(() => {
    // 1. Entrada del título "Sphynx" (fade in + caída suave)
    titleOpacity.value = withTiming(1, { duration: 800 });
    titleTranslateY.value = withSpring(0, { damping: 10 });

    // 2. Entrada del robot (rebote elástico con retardo)
    robotScale.value = withDelay(400, withSpring(1, { damping: 8, stiffness: 90 }));

    // 3. Saludo del robot (giro de lado a lado)
    robotRotation.value = withDelay(
      900,
      withSequence(
        withTiming(-12, { duration: 150 }),
        withTiming(12, { duration: 150 }),
        withTiming(-12, { duration: 150 }),
        withTiming(0, { duration: 150 }),
      ),
    );

    // 4. Terminar el splash y pasar a la app principal
    const timer = setTimeout(onFinish, 3200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const robotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: robotScale.value }, { rotate: `${robotRotation.value}deg` }],
  }));

  return (
    <View
      style={styles.container}
      onLayout={() => {
        // Oculta el splash nativo en cuanto se pinta el nuestro
        NativeSplash.hideAsync().catch(() => {});
      }}>
      <Animated.View style={[styles.titleContainer, titleStyle]}>
        <Text style={styles.appName}>Sphynx</Text>
        <Text style={styles.appTagline}>Física interactiva</Text>
      </Animated.View>

      <Animated.View style={[styles.robotContainer, robotStyle]}>
        <MascotContainer
          imagen={require('@/assets/mascotas/robot.png')}
          ancho={210}
          alto={210}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: UI.fondoVerde,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    zIndex: 1000,
    elevation: 1000,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.five,
  },
  appName: {
    fontSize: 52,
    fontWeight: '900',
    color: UI.azul,
    letterSpacing: 2,
  },
  appTagline: {
    fontSize: 16,
    color: UI.textoSuave,
    marginTop: 6,
    fontWeight: '700',
  },
  robotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});