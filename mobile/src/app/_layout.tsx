import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Slot } from 'expo-router';
import { View } from 'react-native';

import { BottomBar } from '@/components/BottomBar';
import { SplashScreen as SplashAnimado } from '@/components/SplashScreen';

SplashScreen.preventAutoHideAsync();

/**
 * Layout raíz: muestra el splash animado de Sphynx al abrir la app y,
 * cuando termina (~3.2s), revela la ruta actual (Slot) con la barra
 * inferior personalizada (BottomBar).
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashListo, setSplashListo] = useState(false);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Slot />
        <BottomBar />
        {!splashListo && <SplashAnimado onFinish={() => setSplashListo(true)} />}
      </View>
    </ThemeProvider>
  );
}