import { View } from 'react-native';
import { router } from 'expo-router';

import { WelcomeOnboarding } from '@/components/WelcomeOnboarding';
import { UI } from '@/constants/theme';

/**
 * Pantalla BIENVENIDA: repite la presentación inicial.
 * Se abre desde Ajustes → "Ver presentación".
 */
export default function BienvenidaScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: UI.fondoVerde }}>
      <WelcomeOnboarding onStart={() => router.back()} />
    </View>
  );
}