import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Progreso de lecciones completadas (offline-first).
 * Guarda los ids de lección terminados en AsyncStorage para que el
 * mapa de niveles muestre estados: completado / activo / bloqueado.
 */
const COMPLETADAS_KEY = '@sphynx/lecciones_completadas';

export async function obtenerCompletadas(): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(COMPLETADAS_KEY);
    if (!raw) return [];
    const lista = JSON.parse(raw);
    return Array.isArray(lista) ? lista.filter((n) => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

export async function marcarCompletada(leccionId: number): Promise<void> {
  const actual = await obtenerCompletadas();
  if (actual.includes(leccionId)) return;
  await AsyncStorage.setItem(COMPLETADAS_KEY, JSON.stringify([...actual, leccionId]));
}

export async function borrarProgresoLecciones(): Promise<void> {
  await AsyncStorage.removeItem(COMPLETADAS_KEY);
}