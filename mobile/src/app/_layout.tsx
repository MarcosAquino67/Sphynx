import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Slot } from 'expo-router';
import { View } from 'react-native';

import { BottomBar } from '@/components/BottomBar';
import { SplashScreen as SplashAnimado } from '@/components/SplashScreen';
import { WelcomeOnboarding } from '@/components/WelcomeOnboarding';
import { marcarOnboardingVisto, vioOnboarding } from '@/storage/perfil';

SplashScreen.preventAutoHideAsync();

/**
 * Layout raíz: splash animado → (solo primera vez) onboarding de
 * bienvenida → app principal con barra inferior.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashListo, setSplashListo] = useState(false);
  const [onboardingVisto, setOnboardingVisto] = useState<boolean | null>(null);

  useEffect(() => {
    vioOnboarding().then(setOnboardingVisto);
  }, []);

  const terminarOnboarding = () => {
    marcarOnboardingVisto();
    setOnboardingVisto(true);
  };

  const mostrarOnboarding = splashListo && onboardingVisto === false;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        {mostrarOnboarding ? (
          <WelcomeOnboarding onStart={terminarOnboarding} />
        ) : (
          <>
            <Slot />
            <BottomBar />
          </>
        )}
        {!splashListo && <SplashAnimado onFinish={() => setSplashListo(true)} />}
      </View>
    </ThemeProvider>
  );
}