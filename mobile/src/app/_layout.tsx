import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { Slot } from 'expo-router';
import { View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { BottomBar } from '@/components/BottomBar';

SplashScreen.preventAutoHideAsync();

/**
 * Layout raíz: muestra la ruta actual (Slot) y la barra inferior
 * personalizada (BottomBar). Las pantallas de detalle ocultan la barra.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <AnimatedSplashOverlay />
        <Slot />
        <BottomBar />
      </View>
    </ThemeProvider>
  );
}