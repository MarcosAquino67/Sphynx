import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ImageSourcePropType } from 'react-native';

/**
 * Perfil del estudiante (nombre + avatar).
 * El avatar se elige de la galería de mascotas: funciona offline
 * y sin pedir permisos de cámara/galería.
 */
export const AVATARES = {
  robot: require('@/assets/mascotas/robot.png'),
  'gato-saludo': require('@/assets/mascotas/gato-saludo.png'),
  'gato-regla': require('@/assets/mascotas/gato-regla.png'),
  'gato-lapiz': require('@/assets/mascotas/gato-lapiz.png'),
  'gato-calculadora': require('@/assets/mascotas/gato-calculadora.png'),
} as const satisfies Record<string, ImageSourcePropType>;

export type AvatarKey = keyof typeof AVATARES;

const NOMBRE_KEY = '@sphynx/nombre';
const AVATAR_KEY = '@sphynx/avatar';
const FOTO_KEY = '@sphynx/foto_perfil';
const ONBOARDING_KEY = '@sphynx/onboarding_visto';

export async function obtenerNombre(): Promise<string> {
  return (await AsyncStorage.getItem(NOMBRE_KEY)) ?? 'Estudiante';
}

export async function guardarNombre(nombre: string): Promise<void> {
  await AsyncStorage.setItem(NOMBRE_KEY, nombre.trim() || 'Estudiante');
}

export async function obtenerAvatar(): Promise<AvatarKey> {
  const v = await AsyncStorage.getItem(AVATAR_KEY);
  return v !== null && v in AVATARES ? (v as AvatarKey) : 'gato-saludo';
}

export async function guardarAvatar(key: AvatarKey): Promise<void> {
  await AsyncStorage.setItem(AVATAR_KEY, key);
  await AsyncStorage.removeItem(FOTO_KEY);
}

export async function obtenerFoto(): Promise<string | null> {
  return AsyncStorage.getItem(FOTO_KEY);
}

export async function guardarFoto(uri: string): Promise<void> {
  await AsyncStorage.setItem(FOTO_KEY, uri);
}

export async function borrarFoto(): Promise<void> {
  await AsyncStorage.removeItem(FOTO_KEY);
}

export async function vioOnboarding(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'si';
}

export async function marcarOnboardingVisto(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'si');
}