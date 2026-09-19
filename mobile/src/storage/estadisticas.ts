import AsyncStorage from '@react-native-async-storage/async-storage';

const XP_KEY = '@sphynx/xp';
const ACIERTOS_KEY = '@sphynx/aciertos';
const INTENTOS_KEY = '@sphynx/intentos';

export const XP_POR_ACIERTO = 10;

async function readNumber(key: string, fallback: number) {
  const raw = await AsyncStorage.getItem(key);
  const v = raw ? parseInt(raw, 10) : NaN;
  return Number.isNaN(v) ? fallback : v;
}

export type Estadisticas = {
  xp: number;
  aciertos: number;
  intentos: number;
};

export async function obtenerEstadisticas(): Promise<Estadisticas> {
  const [xp, aciertos, intentos] = await Promise.all([
    readNumber(XP_KEY, 0),
    readNumber(ACIERTOS_KEY, 0),
    readNumber(INTENTOS_KEY, 0),
  ]);
  return { xp, aciertos, intentos };
}

export async function registrarRespuesta(esCorrecta: boolean): Promise<void> {
  const [xp, aciertos, intentos] = await Promise.all([
    readNumber(XP_KEY, 0),
    readNumber(ACIERTOS_KEY, 0),
    readNumber(INTENTOS_KEY, 0),
  ]);
  await AsyncStorage.multiSet([
    [INTENTOS_KEY, String(intentos + 1)],
    [ACIERTOS_KEY, String(aciertos + (esCorrecta ? 1 : 0))],
    [XP_KEY, String(xp + (esCorrecta ? XP_POR_ACIERTO : 0))],
  ]);
}

export async function borrarEstadisticas(): Promise<void> {
  await AsyncStorage.multiRemove([XP_KEY, ACIERTOS_KEY, INTENTOS_KEY]);
}