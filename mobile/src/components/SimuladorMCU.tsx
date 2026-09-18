import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Marker, Path } from 'react-native-svg';

import { Button3D } from '@/components/Button3D';
import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { Stepper } from '@/components/Stepper';

const CX = 150;
const CY = 132;
const PX_POR_M = 10.5; // escala del radio

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

type EstadoMCU = { v: number; T: number; f: number; ac: number; R: number };

type Desafio = {
  texto: string;
  check: (v: EstadoMCU) => boolean;
};

/** 5 retos jugables: el jugador ajusta R y ω y comprueba. */
const DESAFIOS: Desafio[] = [
  { texto: 'Lográ velocidad tangencial v = 12 m/s', check: (v) => Math.abs(v.v - 12) < 0.4 },
  { texto: 'Lográ período T = 3.14 s', check: (v) => Math.abs(v.T - 3.14) < 0.1 },
  { texto: 'Lográ aceleración ac = 20 m/s²', check: (v) => Math.abs(v.ac - 20) < 1 },
  { texto: 'Lográ frecuencia f = 9.5 rpm', check: (v) => Math.abs(v.f * 60 - 9.5) < 0.3 },
  { texto: 'Con R = 6 m, lográ v = 6 m/s', check: (v) => v.R === 6 && Math.abs(v.v - 6) < 0.3 },
];

/**
 * Simulador interactivo de MOVIMIENTO CIRCULAR (vista superior).
 * Ajustá el radio (R) y la velocidad angular (ω), dale a Jugar y mirá
 * en vivo la velocidad tangencial (verde) y la aceleración
 * centrípeta (roja, hacia el centro).
 * T = 2π/ω · f = ω/2π · v = ω·R · ac = ω²·R
 */
export function SimuladorMCU() {
  const [R, setR] = useState(8);
  const [omega, setOmega] = useState(1);
  const [jugando, setJugando] = useState(true);
  const [angulo, setAngulo] = useState(0);
  const [idxDesafio, setIdxDesafio] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [ganados, setGanados] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!jugando) return;
    const id = setInterval(() => setAngulo((a) => a + omega * 0.033), 33);
    return () => clearInterval(id);
  }, [jugando, omega]);

  // Limpia el avance automático si se sale de la pantalla
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const T = (2 * Math.PI) / omega;
  const f = omega / (2 * Math.PI);
  const v = omega * R;
  const ac = omega * omega * R;

  const rPx = R * PX_POR_M;
  const px = CX + rPx * Math.cos(angulo);
  const py = CY + rPx * Math.sin(angulo);
  // Dirección tangente (sentido del giro) y vector velocidad
  const tx = -Math.sin(angulo);
  const ty = Math.cos(angulo);
  const vLen = Math.min(70, v * 3);
  // Aceleración centrípeta: hacia el centro
  const acLen = Math.min(60, ac * 1.2);
  const acx = CX - px;
  const acy = CY - py;
  const acNorm = Math.hypot(acx, acy) || 1;

  // --- Juego: modo desafío ---
  const desafio = DESAFIOS[idxDesafio];

  const comprobar = () => {
    if (desafio.check({ v, T, f, ac, R })) {
      setGanados((g) => g + 1);
      setMensaje('🎉 ¡Desafío logrado! ¡Iporã! Pasando al siguiente...');
      // Avanza solo al siguiente desafío tras festejarlo
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIdxDesafio((i) => (i + 1) % DESAFIOS.length);
        setMensaje('');
      }, 1800);
    } else {
      setMensaje('❌ Todavía no... ¡Probá otra vez!');
    }
  };

  const otroDesafio = () => {
    setIdxDesafio((i) => (i + 1) % DESAFIOS.length);
    setMensaje('');
  };

  return (
    <View style={styles.tarjeta}>
      <Text style={styles.titulo}>🌀 Laboratorio circular</Text>

      <View style={styles.lienzo}>
        <Svg width="100%" height={250} viewBox="0 0 300 264">
          <Marker id="mAzul" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <Path d="M0,0 L6,3 L0,6 z" fill={UI.azulOscuro} />
          </Marker>
          <Marker id="mVerde" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <Path d="M0,0 L6,3 L0,6 z" fill="#2ECC71" />
          </Marker>
          <Marker id="mRojo" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <Path d="M0,0 L6,3 L0,6 z" fill="#E74C3C" />
          </Marker>

          {/* Trayectoria */}
          <Circle cx={CX} cy={CY} r={rPx} fill="none" stroke={UI.textoSuave} strokeWidth={1.5} strokeDasharray="7,5" />
          {/* Centro */}
          <Line x1={CX - 7} y1={CY} x2={CX + 7} y2={CY} stroke={UI.texto} strokeWidth={2} />
          <Line x1={CX} y1={CY - 7} x2={CX} y2={CY + 7} stroke={UI.texto} strokeWidth={2} />

          {/* Brazo del radio */}
          <Line x1={CX} y1={CY} x2={px} y2={py} stroke={UI.azulOscuro} strokeWidth={2.5} markerEnd="url(#mAzul)" />

          {/* Velocidad tangencial (verde) */}
          <Line
            x1={px}
            y1={py}
            x2={px + tx * vLen}
            y2={py + ty * vLen}
            stroke="#2ECC71"
            strokeWidth={3}
            markerEnd="url(#mVerde)"
          />

          {/* Aceleración centrípeta (roja, al centro) */}
          <Line
            x1={px}
            y1={py}
            x2={px + (acx / acNorm) * acLen}
            y2={py + (acy / acNorm) * acLen}
            stroke="#E74C3C"
            strokeWidth={3}
            strokeDasharray="6,3"
            markerEnd="url(#mRojo)"
          />

          {/* Móvil */}
          <Circle cx={px} cy={py} r={9} fill={UI.azul} stroke={UI.azulOscuro} strokeWidth={2.5} />
        </Svg>
      </View>

      <View style={styles.controles}>
        <Stepper etiqueta="Radio (R)" valor={`${R} m`} onMenos={() => setR((r) => clamp(r - 1, 4, 12))} onMas={() => setR((r) => clamp(r + 1, 4, 12))} />
        <Stepper
          etiqueta="Vel. angular (ω)"
          valor={`${omega.toFixed(1)} rad/s`}
          onMenos={() => setOmega((w) => clamp(Math.round((w - 0.2) * 10) / 10, 0.2, 2))}
          onMas={() => setOmega((w) => clamp(Math.round((w + 0.2) * 10) / 10, 0.2, 2))}
        />
      </View>

      <Button3D
        titulo={jugando ? 'Pausar' : 'Jugar'}
        icono={jugando ? 'pause' : 'play'}
        color={UI.naranja}
        colorBorde={UI.naranjaOscuro}
        onPress={() => setJugando((j) => !j)}
      />

      {/* Lecturas */}
      <View style={styles.lecturas}>
        <Text style={styles.lectura}>
          T = {T.toFixed(2)} s · f = {f.toFixed(2)} Hz ({(f * 60).toFixed(0)} rpm)
        </Text>
        <Text style={styles.lectura}>
          v = {v.toFixed(1)} m/s · ac = {ac.toFixed(1)} m/s²
        </Text>
        <Text style={styles.naturaleza}>Rapidez constante, dirección cambiante</Text>
      </View>

      {/* Juego de desafío */}
      <View style={styles.desafio}>
        <Text style={styles.desafioTitulo}>
          🎮 Desafío {idxDesafio + 1}/{DESAFIOS.length}
        </Text>
        <Text style={styles.desafioTexto}>{desafio.texto}</Text>
        <Button3D
          titulo="¡Comprobar!"
          icono="check"
          color={UI.verde}
          colorBorde={UI.verdeOscuro}
          onPress={comprobar}
        />
        <Pressable onPress={otroDesafio} style={({ pressed }) => [styles.otroBtn, pressed && styles.otroBtnPresionado]}>
          <Text style={styles.otroBtnTexto}>🔀 Cambiar de desafío</Text>
        </Pressable>
        {mensaje !== '' && <Text style={styles.mensaje}>{mensaje}</Text>}
        <Text style={styles.ganados}>🏆 Desafíos logrados: {ganados}</Text>
      </View>

      <Text style={styles.fuente}>Modelo interactivo estilo PhET · Código original Sphynx</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    width: '100%',
    backgroundColor: UI.tarjeta,
    borderRadius: RADIO_TARJETA,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    padding: Spacing.three,
    gap: Spacing.two,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  titulo: {
    fontSize: 17,
    fontWeight: '900',
    color: UI.texto,
    textAlign: 'center',
  },
  lienzo: {
    backgroundColor: UI.fondoCeleste,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: UI.bordeTarjeta,
    overflow: 'hidden',
  },
  controles: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  lecturas: {
    backgroundColor: UI.fondoVerde,
    borderRadius: 14,
    padding: Spacing.two,
    gap: 2,
  },
  lectura: {
    fontSize: 13,
    fontWeight: '700',
    color: UI.texto,
    textAlign: 'center',
  },
  naturaleza: {
    fontSize: 13,
    fontWeight: '900',
    color: UI.azulOscuro,
    textAlign: 'center',
  },
  desafio: {
    backgroundColor: UI.fondoVerde,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: UI.verdeOscuro,
    padding: Spacing.three,
    gap: Spacing.two,
    alignItems: 'center',
  },
  desafioTitulo: {
    fontSize: 15,
    fontWeight: '900',
    color: UI.texto,
  },
  desafioTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: UI.texto,
    textAlign: 'center',
    lineHeight: 19,
  },
  otroBtn: {
    width: '100%',
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.azul,
    borderBottomWidth: 5,
    borderRadius: 14,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  otroBtnPresionado: {
    opacity: 0.8,
  },
  otroBtnTexto: {
    fontSize: 14,
    fontWeight: '800',
    color: UI.azulOscuro,
  },
  mensaje: {
    fontSize: 14,
    fontWeight: '800',
    color: UI.texto,
    textAlign: 'center',
  },
  ganados: {
    fontSize: 13,
    fontWeight: '800',
    color: UI.verdeOscuro,
  },
  fuente: {
    fontSize: 10,
    fontStyle: 'italic',
    color: UI.textoSuave,
    textAlign: 'center',
  },
});