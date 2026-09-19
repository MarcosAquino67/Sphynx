import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Slot } from 'expo-router';
import { View } from 'react-native';

import { BottomBar } from '@/components/BottomBar';
import { SplashScreen as PantallaCarga } from '@/components/SplashScreen';
import { WelcomeOnboarding } from '@/components/WelcomeOnboarding';

SplashScreen.preventAutoHideAsync();

/**
 * Layout raíz: pantalla de carga (logo + barra) → presentación
 * de bienvenida (SIEMPRE, en cada apertura) → app principal
 * con barra inferior.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [cargaLista, setCargaLista] = useState(false);
  const [presentacionLista, setPresentacionLista] = useState(false);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar hidden />
      <View style={{ flex: 1 }}>
        {!presentacionLista ? (
          !cargaLista ? (
            <PantallaCarga onFinish={() => setCargaLista(true)} />
          ) : (
            <WelcomeOnboarding onStart={() => setPresentacionLista(true)} />
          )
        ) : (
          <>
            <Slot />
            <BottomBar />
          </>
        )}
      </View>
    </ThemeProvider>
  );
}