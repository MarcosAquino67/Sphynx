import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Slot } from 'expo-router';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BottomBar } from '@/components/BottomBar';
import { SplashScreen as PantallaCarga } from '@/components/SplashScreen';
import { WelcomeOnboarding } from '@/components/WelcomeOnboarding';
import { IdiomaProvider } from '@/context/IdiomaContext';

SplashScreen.preventAutoHideAsync();

const ONBOARDING_KEY = '@sphynx/onboarding_visto';

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
              <Slot />
              <BottomBar />
            </>
          )}
        </View>
      </IdiomaProvider>
    </ThemeProvider>
  );
}