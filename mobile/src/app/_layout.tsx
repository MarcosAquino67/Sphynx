import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, useColorScheme, View } from 'react-native';
import { router, Slot, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BottomBar } from '@/components/BottomBar';
import { SplashScreen as PantallaCarga } from '@/components/SplashScreen';
import { WelcomeOnboarding } from '@/components/WelcomeOnboarding';
import { IdiomaProvider } from '@/context/IdiomaContext';
import { playAmbiente, stopAmbiente } from '@/services/sonidos';

SplashScreen.preventAutoHideAsync();

const ONBOARDING_KEY = '@sphynx/onboarding_visto';

const TABS_ORDEN = ['/', '/progreso', '/perfil', '/sphynx-ia', '/ajustes'] as const;
const RUTAS_SIN_SWIPE = ['/unidad', '/subtemas', '/niveles', '/teoria', '/leccion', '/experimento', '/creditos', '/bienvenida'];

/**
 * Layout raíz: pantalla de carga (logo + barra) → presentación
 * de bienvenida (SOLO la primera vez en este teléfono) → app
 * principal con barra inferior. Después queda guardado en el celu.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [cargaLista, setCargaLista] = useState(false);
  const [onboardingVisto, setOnboardingVisto] = useState<boolean | null>(null);
  const [presentacionLista, setPresentacionLista] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((v) => setOnboardingVisto(v === 'si'));
  }, []);

  const terminarPresentacion = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'si');
    setOnboardingVisto(true);
    setPresentacionLista(true);
  };

  const pathname = usePathname();
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_evt, { dx, dy }) =>
          Math.abs(dx) > 18 && Math.abs(dx) > Math.abs(dy) * 1.2,
        onPanResponderMove: (_evt, { dx }) => {
          const esRutaTab = (TABS_ORDEN as readonly string[]).includes(pathname);
          const esRutaOculta = RUTAS_SIN_SWIPE.some((r) => pathname === r || pathname.startsWith(`${r}/`));
          if (!esRutaTab || esRutaOculta) return;
          // Efecto TikTok: la pantalla sigue un poco el dedo (máx 28% del ancho)
          const clamped = Math.max(-90, Math.min(90, dx * 0.35));
          translateX.setValue(clamped);
        },
        onPanResponderRelease: (_evt, { dx, vx }) => {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true, bounciness: 6, speed: 14 }).start();
          const esRutaTab = (TABS_ORDEN as readonly string[]).includes(pathname);
          const esRutaOculta = RUTAS_SIN_SWIPE.some((r) => pathname === r || pathname.startsWith(`${r}/`));
          if (!esRutaTab || esRutaOculta) return;
          const idx = (TABS_ORDEN as readonly string[]).indexOf(pathname);
          const swipeIzq = dx < -60 || (dx < -30 && vx < -0.45);
          const swipeDer = dx > 60 || (dx > 30 && vx > 0.45);
          if (swipeIzq && idx < TABS_ORDEN.length - 1) {
            router.replace(TABS_ORDEN[idx + 1] as any);
          } else if (swipeDer && idx > 0) {
            router.replace(TABS_ORDEN[idx - 1] as any);
          }
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        },
      }),
    [pathname, translateX],
  );

  useEffect(() => {
    if (!cargaLista || onboardingVisto !== true) {
      stopAmbiente();
      return;
    }
    // Música ambiente en los 5 tabs principales (Inicio/Progreso/Perfil/SPHYNX IA/Ajustes)
    const enTab = (TABS_ORDEN as readonly string[]).includes(pathname);
    if (enTab) playAmbiente();
    else stopAmbiente();
  }, [cargaLista, onboardingVisto, pathname, presentacionLista]);

  // Mientras carga la barra o aún no sabemos si ya vio el onboarding, mostramos la carga
  const mostrarOnboarding = cargaLista && onboardingVisto === false && !presentacionLista;
  const mostrarApp = cargaLista && (onboardingVisto === true || presentacionLista);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <IdiomaProvider>
        <StatusBar hidden />
        <View style={{ flex: 1 }}>
          {!mostrarApp ? (
            !cargaLista ? (
              <PantallaCarga onFinish={() => setCargaLista(true)} />
            ) : mostrarOnboarding ? (
              <WelcomeOnboarding onStart={terminarPresentacion} />
            ) : (
              // Esperando a leer AsyncStorage, mantenemos la carga
              <PantallaCarga onFinish={() => setCargaLista(true)} />
            )
          ) : (
            <>
              <Animated.View style={{ flex: 1, transform: [{ translateX }] }} {...panResponder.panHandlers}>
                <Slot />
              </Animated.View>
              <BottomBar />
            </>
          )}
        </View>
      </IdiomaProvider>
    </ThemeProvider>
  );
}