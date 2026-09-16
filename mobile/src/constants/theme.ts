/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Sphynx = {
  green: '#58CC02',
  greenDark: '#58A700',
  blue: '#1CB0F6',
  orange: '#FF9600',
  red: '#FF4B4B',
  gold: '#FFC800',
  bgDark: '#131F24',
  cardBg: '#F7F7F7',
  cardBgDark: '#1E2E35',
  // Interfaz estilo mockup "Fisik-IA"
  bgSoft: '#EAF3F6',
  nodeBlue: '#4D9FDB',
  nodeBlueDark: '#3B7FB8',
  checkGreen: '#3CB85C',
  correct: '#2ECC71',
  wrong: '#E74C3C',
  locked: '#CBD3D9',
  lockedDark: '#AEB6BF',
  border: '#D5DBDB',
  textDark: '#2C3E50',
  banner: '#5D6D7E',
} as const;

/**
 * Paleta pastel de la interfaz gamificada (mockups "Sphynx / Fisik-IA").
 * Fondos claros, tarjetas blancas con borde contrastado y botones 3D.
 */
export const UI = {
  fondoVerde: '#E8F6EF',
  fondoCeleste: '#E6F7FF',
  tarjeta: '#FFFFFF',
  bordeTarjeta: '#D9E6DD',
  texto: '#2E3A33',
  textoSuave: '#6B7B70',
  // Colores de botones 3D (cara + borde inferior oscuro para el volumen)
  naranja: '#FF9F45',
  naranjaOscuro: '#D9731A',
  azul: '#3FA7F5',
  azulOscuro: '#2B7FC4',
  verde: '#4CAF6D',
  verdeOscuro: '#358A52',
  rojo: '#E86A5E',
  rojoOscuro: '#B94A40',
  morado: '#B388EB',
  moradoOscuro: '#8E63D6',
  // Nodos metálicos del mapa de niveles
  metalClaro: '#EDF1F4',
  metal: '#B9C2CB',
  metalOscuro: '#8E99A3',
  estrella: '#FFC93C',
  barraFondo: '#FFFFFF',
  iconoInactivo: '#9AA5A1',
} as const;

/** Radio estándar de tarjetas blancas (mockups: 20-25). */
export const RADIO_TARJETA = 22;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
