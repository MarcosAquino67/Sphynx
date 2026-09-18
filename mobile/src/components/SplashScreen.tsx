import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as NativeSplash from 'expo-splash-screen';

import { Spacing, UI } from '@/constants/theme';

// Tiempos de la barra (ms): llena hasta 67%, espera, y completa hasta 100%
const T_LLENA_67 = 1300;
const T_ESPERA_67 = 1000;
const T_COMPLETA = 700;

type Props = {
  /** Se llama al llegar a 100% para pasar a la presentación. */
  onFinish: () => void;
};

/**
 * Pantalla de carga inicial: logo Sphynx sobre negro + barra de
 * progreso (1→67% en ~1.3s, pausa 1s en 67%, 67→100% y avanza).
 */
export function SplashScreen({ onFinish }: Props) {
  const [progreso, setProgreso] = useState(1);

  useEffect(() => {
    const inicio = Date.now();
    const id = setInterval(() => {
      const t = Date.now() - inicio;
      let p: number;
      if (t < T_LLENA_67) {
        p = 1 + (66 * t) / T_LLENA_67;
      } else if (t < T_LLENA_67 + T_ESPERA_67) {
        p = 67;
      } else if (t < T_LLENA_67 + T_ESPERA_67 + T_COMPLETA) {
        p = 67 + (33 * (t - T_LLENA_67 - T_ESPERA_67)) / T_COMPLETA;
      } else {
        p = 100;
      }
      setProgreso(Math.min(100, Math.round(p)));
      if (p >= 100) {
        clearInterval(id);
        setTimeout(onFinish, 250);
      }
    }, 50);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={styles.container}
      onLayout={() => {
        // Oculta el splash nativo en cuanto se pinta la carga
        NativeSplash.hideAsync().catch(() => {});
      }}>
      <Image
        source={require('@/assets/SPHYNX_png.png')}
        style={styles.logo}
        contentFit="contain"
      />

      <View style={styles.barraFondo}>
        <View style={[styles.barraRelleno, { width: `${progreso}%` }]} />
      </View>
      <Text style={styles.porcentaje}>{progreso}%</Text>
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
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    zIndex: 1000,
    elevation: 1000,
  },
  logo: {
    width: 280,
    height: 280,
  },
  barraFondo: {
    marginTop: Spacing.five,
    width: '70%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333333',
    overflow: 'hidden',
  },
  barraRelleno: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: UI.azul,
  },
  porcentaje: {
    marginTop: Spacing.two,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});