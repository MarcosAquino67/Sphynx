import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Idioma } from '@/context/IdiomaContext';

// URL del backend (donde corre uvicorn con la OPENCODE_API_KEY).
// Prioridad: 1) lo que guardes en Ajustes → Servidor IA (@sphynx/api_url),
// 2) EXPO_PUBLIC_API_URL de compilación, 3) localhost.
// En Expo Go/APK el celu NO llega a localhost: usá la IP LAN de tu PC, ej:
// http://192.168.1.5:8000 (misma Wi-Fi que el celu).
export const API_URL_KEY = '@sphynx/api_url';
const API_URL_DEFAULT = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export async function getApiUrl(): Promise<string> {
  const custom = (await AsyncStorage.getItem(API_URL_KEY))?.trim();
  return custom || API_URL_DEFAULT;
}

export type MensajeIA = {
  rol: 'usuario' | 'ia';
  texto: string;
};

export async function preguntarSphynxIA(opts: {
  texto: string;
  idioma: Idioma;
  imagenBase64?: string | null;
  historial: MensajeIA[];
}): Promise<string> {
  const base = await getApiUrl();
  let res: Response;
  try {
    res = await fetch(`${base}/api/ia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texto: opts.texto,
        idioma: opts.idioma,
        imagen_base64: opts.imagenBase64 ?? null,
        historial: opts.historial.slice(-8),
      }),
    });
  } catch {
    throw new Error(
      opts.idioma === 'jopara'
        ? `Ndajuhúi servidor (${base}). Eikotevẽ misma Wi-Fi ha backend oñemopu'ãva, térã emoambue IP Ajustes → Servidor IA-pe.`
        : `No llegué al servidor (${base}). Misma Wi-Fi + backend levantado, o cambiá la IP en Ajustes → Servidor IA.`,
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data?.detail === 'string' ? data.detail : `Error ${res.status}: no pude hablar con la IA`,
    );
  }
  return String(data.respuesta ?? '...');
}
