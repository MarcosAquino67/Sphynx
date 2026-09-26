import type { Idioma } from '@/context/IdiomaContext';

// URL del backend (donde corre uvicorn con la OPENROUTER_API_KEY).
// En Expo Go el celu NO llega a localhost: usá la IP LAN de tu PC, ej:
// EXPO_PUBLIC_API_URL=http://192.168.1.5:8000  (npx expo start -c)
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

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
  const res = await fetch(`${API_URL}/api/ia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      texto: opts.texto,
      idioma: opts.idioma,
      imagen_base64: opts.imagenBase64 ?? null,
      historial: opts.historial.slice(-8),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data?.detail === 'string' ? data.detail : `Error ${res.status}: no pude hablar con la IA`,
    );
  }
  return String(data.respuesta ?? '...');
}
