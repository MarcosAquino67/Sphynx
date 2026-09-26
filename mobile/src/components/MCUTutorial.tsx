import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';

import { Spacing, UI } from '@/constants/theme';
import { playClic } from '@/services/sonidos';

/**
 * IMPORTANTE: este es un placeholder del gato tutor.
 * Cuando el usuario guarde su imagen exacta como
 * mobile/assets/mascotas/gato-tutor.png (sin fondo),
 * se usa automáticamente sin tocar este código.
 */
const GATO_TUTOR = require('@/assets/mascotas/gato-tutor.png');

const STORAGE_KEY = '@sphynx/mcu_tutorial_visto';
const MS_POR_LETRA = 18;

type Paso = {
  texto: string;
  typewriter: boolean;
  pie: string;
};

const PASOS: Paso[] = [
  {
    texto: '¡Hola! Te voy a ayudar a repasar este tema.',
    typewriter: false,
    pie: 'Toca una vez para continuar',
  },
  {
    texto: 'Primero veremos qué es el Movimiento Circular Uniforme y sus principales magnitudes.',
    typewriter: true,
    pie: 'Toca una vez para continuar',
  },
  {
    texto: 'En este tema aprenderás el período, la frecuencia, la velocidad angular, la velocidad tangencial y la aceleración centrípeta.',
    typewriter: true,
    pie: '¡Vamos a empezar!',
  },
];

/**
 * Tutorial introductorio estilo videojuego para Movimiento Circular Uniforme.
 * Solo se muestra LA PRIMERA VEZ (AsyncStorage mcuTutorialCompleted);
 * después renderiza null y la pantalla queda normal.
 * Estados: 0 saludo → 1 explicación → 2 magnitudes → salida → listo.
 */
export function MCUTutorial() {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [paso, setPaso] = useState(0);
  const [letras, setLetras] = useState(PASOS[0].texto.length);
  const [escribiendo, setEscribiendo] = useState(false);
  const [saliendo, setSaliendo] = useState(false);

  const overlayOp = useRef(new Animated.Value(0)).current;
  const gatoX = useRef(new Animated.Value(-320)).current;
  const gatoOp = useRef(new Animated.Value(0)).current;
  const globoOp = useRef(new Animated.Value(0)).current;
  const globoScale = useRef(new Animated.Value(0.95)).current;

  const chico = width < 360;
  const gatoAncho = chico ? 118 : 150;

  // 1) ¿Ya lo vio? Si no, entra con animación de videojuego.
  useEffect(() => {
    let vivo = true;
    (async () => {
      const visto = await AsyncStorage.getItem(STORAGE_KEY);
      if (!vivo) return;
      if (visto === 'si') {
        setVisible(false);
        return;
      }
      setVisible(true);
      Animated.timing(overlayOp, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      Animated.parallel([
        Animated.timing(gatoX, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(gatoOp, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start(() => {
        Animated.parallel([
          Animated.timing(globoOp, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.spring(globoScale, { toValue: 1, useNativeDriver: true, bounciness: 8, speed: 12 }),
        ]).start();
      });
    })();
    return () => {
      vivo = false;
    };
  }, [overlayOp, gatoX, gatoOp, globoOp, globoScale]);

  // 2) Efecto typewriter en los pasos que lo piden.
  useEffect(() => {
    if (!visible || !PASOS[paso].typewriter) {
      setEscribiendo(false);
      setLetras(PASOS[paso].texto.length);
      return;
    }
    setEscribiendo(true);
    setLetras(0);
    const timer = setInterval(() => {
      setLetras((n) => {
        if (n + 1 >= PASOS[paso].texto.length) {
          clearInterval(timer);
          setEscribiendo(false);
          return PASOS[paso].texto.length;
        }
        return n + 1;
      });
    }, MS_POR_LETRA);
    return () => clearInterval(timer);
  }, [paso, visible]);

  if (!visible) return null;

  const avanzar = () => {
    if (escribiendo || saliendo) return;
    playClic();
    if (paso < PASOS.length - 1) {
      setPaso((p) => p + 1);
      return;
    }
    // 3) Salida: el gato vuelve por la izquierda + fade-out general.
    setSaliendo(true);
    Animated.parallel([
      Animated.timing(gatoX, {
        toValue: -320,
        duration: 600,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(gatoOp, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(globoOp, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(overlayOp, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(async () => {
      await AsyncStorage.setItem(STORAGE_KEY, 'si');
      setVisible(false);
    });
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOp }]}>
      <View style={styles.fila}>
        <Animated.View style={{ transform: [{ translateX: gatoX }], opacity: gatoOp }}>
          <Image source={GATO_TUTOR} style={{ width: gatoAncho, height: gatoAncho * 1.1 }} contentFit="contain" />
        </Animated.View>

        <Animated.View style={[styles.globoWrap, { opacity: globoOp, transform: [{ scale: globoScale }] }]}>
          <Pressable onPress={avanzar} style={styles.globo} accessibilityRole="button">
            <View style={styles.punta} />
            <Text style={[styles.globoTexto, chico && styles.globoTextoChico]}>
              {PASOS[paso].texto.slice(0, letras)}
            </Text>
          </Pressable>
          {!escribiendo && (
            <Text style={styles.pie}>··· {PASOS[paso].pie} ···</Text>
          )}
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(4, 20, 40, 0.62)',
    justifyContent: 'center',
    zIndex: 50,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  globoWrap: {
    flex: 1,
    marginLeft: 2,
  },
  globo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: UI.azul,
    padding: Spacing.three,
    minHeight: 118,
    justifyContent: 'center',
    shadowColor: UI.azul,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  // Puntita del globo apuntando al gato
  punta: {
    position: 'absolute',
    left: -11,
    top: 34,
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: UI.azul,
    transform: [{ rotate: '45deg' }],
  },
  globoTexto: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
    color: UI.azulOscuro,
  },
  globoTextoChico: {
    fontSize: 15,
    lineHeight: 22,
  },
  pie: {
    marginTop: Spacing.two,
    fontSize: 13,
    fontWeight: '800',
    color: '#BFE3FF',
    textAlign: 'center',
  },
});
