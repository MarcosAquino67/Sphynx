import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer } from 'expo-audio';

const SONIDO_KEY = '@sphynx/sonido';

// Players perezosos para no crearlos hasta el primer uso
let clicPlayer: ReturnType<typeof createAudioPlayer> | null = null;
let aciertoPlayer: ReturnType<typeof createAudioPlayer> | null = null;
let errorPlayer: ReturnType<typeof createAudioPlayer> | null = null;
let ambientePlayer: ReturnType<typeof createAudioPlayer> | null = null;
let cuestionarioPlayer: ReturnType<typeof createAudioPlayer> | null = null;

function getClic() {
  if (!clicPlayer) clicPlayer = createAudioPlayer(require('@/assets/sonidos/clic.mp3'));
  return clicPlayer;
}
function getAcierto() {
  if (!aciertoPlayer) aciertoPlayer = createAudioPlayer(require('@/assets/sonidos/acierto.mp3'));
  return aciertoPlayer;
}
function getError() {
  if (!errorPlayer) errorPlayer = createAudioPlayer(require('@/assets/sonidos/error.mp3'));
  return errorPlayer;
}
function getAmbiente() {
  if (!ambientePlayer) {
    ambientePlayer = createAudioPlayer(require('@/assets/sonidos/ambiente_menu.mp3'));
    ambientePlayer.loop = true;
    ambientePlayer.volume = 0.35;
  }
  return ambientePlayer;
}
function getCuestionario() {
  if (!cuestionarioPlayer) {
    cuestionarioPlayer = createAudioPlayer(require('@/assets/sonidos/cuestionario.mp3'));
    cuestionarioPlayer.loop = true;
    cuestionarioPlayer.volume = 0.35;
  }
  return cuestionarioPlayer;
}

async function sonidoActivado(): Promise<boolean> {
  const v = await AsyncStorage.getItem(SONIDO_KEY);
  return v !== 'off';
}

export async function playClic(): Promise<void> {
  if (!(await sonidoActivado())) return;
  try {
    const p = getClic();
    p.seekTo(0);
    p.play();
  } catch {}
}

export async function playAcierto(): Promise<void> {
  if (!(await sonidoActivado())) return;
  try {
    const p = getAcierto();
    p.seekTo(0);
    p.play();
  } catch {}
}

export async function playError(): Promise<void> {
  if (!(await sonidoActivado())) return;
  try {
    const p = getError();
    p.seekTo(0);
    p.play();
  } catch {}
}

export async function playAmbiente(): Promise<void> {
  if (!(await sonidoActivado())) return;
  try {
    cuestionarioPlayer?.pause();
    const p = getAmbiente();
    if (!p.playing) p.play();
  } catch {}
}

export async function stopAmbiente(): Promise<void> {
  try {
    ambientePlayer?.pause();
  } catch {}
}

export async function playCuestionario(): Promise<void> {
  if (!(await sonidoActivado())) return;
  try {
    ambientePlayer?.pause();
    const p = getCuestionario();
    if (!p.playing) p.play();
  } catch {}
}

export async function stopCuestionario(): Promise<void> {
  try {
    cuestionarioPlayer?.pause();
  } catch {}
}