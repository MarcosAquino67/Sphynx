import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Marker, Path } from 'react-native-svg';

import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { Button3D } from '@/components/Button3D';
import { Stepper } from '@/components/Stepper';

// Lienzo del diagrama (viewBox) y escala física
const VB_W = 400;
const VB_H = 250;
const EJE_Y = 150;
const PX_POR_CM = 5;
const OBJ_H_CM = 8;

type Tipo = 'convergente' | 'divergente';

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

type EstadoOptico = { di: number; m: number; inf: boolean };

type Desafio = {
  texto: string;
  requiere?: Tipo;
  check: (v: EstadoOptico) => boolean;
};

/** 5 retos jugables: el jugador mueve la lente/objeto y comprueba. */
const DESAFIOS: Desafio[] = [
  {
    texto: 'Con lente CONVERGENTE: formá una imagen real a di = 30 cm',
    requiere: 'convergente',
    check: (v) => !v.inf && v.di > 0 && Math.abs(v.di - 30) < 1.5,
  },
  {
    texto: 'Con lente DIVERGENTE: formá una imagen virtual con di = −12 cm',
    requiere: 'divergente',
    check: (v) => !v.inf && Math.abs(v.di + 12) < 1.5,
  },
  {
    texto: 'Con lente CONVERGENTE: lográ aumento |A| = 2 (imagen doble)',
    requiere: 'convergente',
    check: (v) => !v.inf && Math.abs(Math.abs(v.m) - 2) < 0.15,
  },
  {
    texto: 'Formá una imagen VIRTUAL, derecha y menor (cualquier lente)',
    check: (v) => !v.inf && v.di < 0,
  },
  {
    texto: 'Con lente CONVERGENTE: imagen del MISMO tamaño (|A| = 1)',
    requiere: 'convergente',
    check: (v) => !v.inf && Math.abs(Math.abs(v.m) - 1) < 0.1,
  },
];

/**
 * Simulador interactivo de LENTES (inspirado en PhET Geometric Optics).
 * - Arrastrá la flecha roja (objeto) y la lente azul con el dedo.
 * - Ajustá la distancia focal con + / − y cambiá el tipo de lente.
 * - Dibuja los 3 rayos principales y la imagen (real/virtual).
 * Ecuación: 1/f = 1/do + 1/di · Aumento: m = −di/do
 */
export function SimuladorLentes() {
  const [tipo, setTipo] = useState<Tipo>('convergente');
  const [f, setF] = useState(12);
  const [objX, setObjX] = useState(60);
  const [lensX, setLensX] = useState(200);
  const [ancho, setAncho] = useState(0);
  const [idxDesafio, setIdxDesafio] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [ganados, setGanados] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Limpia el avance automático si se sale de la pantalla
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const objRef = useRef(objX);
  const lensRef = useRef(lensX);
  objRef.current = objX;
  lensRef.current = lensX;
  const arrastre = useRef<'obj' | 'lente' | null>(null);
  const base = useRef({ x: 0, obj: 0, lens: 0 });

  // Arrastre horizontal: elige objeto o lente según el punto tocado
  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
          const x = ancho > 0 ? (e.nativeEvent.locationX / ancho) * VB_W : 0;
          arrastre.current = Math.abs(x - objRef.current) < Math.abs(x - lensRef.current) ? 'obj' : 'lente';
          base.current = { x, obj: objRef.current, lens: lensRef.current };
        },
        onPanResponderMove: (e) => {
          const x = ancho > 0 ? (e.nativeEvent.locationX / ancho) * VB_W : 0;
          const dx = x - base.current.x;
          if (arrastre.current === 'obj') {
            setObjX(clamp(base.current.obj + dx, 16, base.current.lens - 10));
          } else if (arrastre.current === 'lente') {
            setLensX(clamp(base.current.lens + dx, 120, 280));
          }
        },
        onPanResponderRelease: () => {
          arrastre.current = null;
        },
        onPanResponderTerminate: () => {
          arrastre.current = null;
        },
      }),
    [ancho],
  );

  // --- Física ---
  const fS = tipo === 'convergente' ? f : -f;
  const doi = (lensX - objX) / PX_POR_CM;
  const denom = 1 / fS - 1 / doi;
  const infinito = Math.abs(denom) < 0.004;
  const di = infinito ? 0 : 1 / denom;
  const m = infinito ? 0 : -di / doi;
  const ix = lensX + di * PX_POR_CM;
  const conv = tipo === 'convergente';

  const naturaleza = infinito
    ? 'Imagen en el infinito'
    : di > 0
      ? `Real · ${m < 0 ? 'Invertida' : 'Derecha'} · ${Math.abs(m) > 1.05 ? 'Mayor' : Math.abs(m) < 0.95 ? 'Menor' : 'Igual'}`
      : 'Virtual · Derecha · Menor';

  // --- Geometría del diagrama ---
  const O = { x: objX, y: EJE_Y - OBJ_H_CM * PX_POR_CM };
  const fPx = f * PX_POR_CM;
  const Fcerca = { x: lensX - fPx, y: EJE_Y }; // foco lado objeto (|f|)
  const Flejos = { x: lensX + fPx, y: EJE_Y }; // foco lado imagen (|f|)
  const finX = 395; // hasta dónde se dibujan los rayos refractados
  const imgTopY = EJE_Y - m * OBJ_H_CM * PX_POR_CM;
  const verImagen = !infinito && ix > -10 && ix < 410;

  // Rayo 3 (focal) solo si el objeto está fuera del foco (convergente)
  const dibujarRayo3 = conv ? doi > f : true;
  let pFocalY = EJE_Y;
  if (dibujarRayo3) {
    const ref = conv ? Fcerca : Flejos;
    const t = (lensX - O.x) / (ref.x - O.x);
    pFocalY = O.y + t * (EJE_Y - O.y);
  }

  // Punto del rayo 1 refractado a la altura del plano imagen (para punteadas virtuales)
  const dirRayo1 = conv
    ? { dx: Flejos.x - lensX, dy: EJE_Y - O.y }
    : { dx: lensX - Fcerca.x, dy: O.y - EJE_Y };

  // --- Juego: modo desafío ---
  const desafio = DESAFIOS[idxDesafio];

  const comprobar = () => {
    if (desafio.requiere && tipo !== desafio.requiere) {
      setMensaje(`⚠️ Primero cambiá a lente ${desafio.requiere === 'convergente' ? 'CONVERGENTE' : 'DIVERGENTE'}.`);
      return;
    }
    if (desafio.check({ di, m, inf: infinito })) {
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
      <Text style={styles.titulo}>🔬 Laboratorio de lentes</Text>
      <Text style={styles.ayuda}>Arrastrá la flecha roja y la lente azul ↔</Text>

      <View
        style={styles.lienzo}
        onLayout={(e) => setAncho(e.nativeEvent.layout.width)}
        {...pan.panHandlers}>
        <Svg width="100%" height={230} viewBox={`0 0 ${VB_W} ${VB_H}`}>
          <Marker id="mR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <Path d="M0,0 L6,3 L0,6 z" fill="#E74C3C" />
          </Marker>
          <Marker id="mV" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <Path d="M0,0 L6,3 L0,6 z" fill="#2ECC71" />
          </Marker>
          <Marker id="mA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <Path d="M0,0 L6,3 L0,6 z" fill="#F5A623" />
          </Marker>

          {/* Eje principal */}
          <Line x1={8} y1={EJE_Y} x2={392} y2={EJE_Y} stroke={UI.textoSuave} strokeWidth={1.5} />

          {/* Focos */}
          {conv ? (
            <>
              <Path d={`M${Fcerca.x - 5},${EJE_Y - 5} L${Fcerca.x + 5},${EJE_Y + 5} M${Fcerca.x + 5},${EJE_Y - 5} L${Fcerca.x - 5},${EJE_Y + 5}`} stroke={UI.texto} strokeWidth={2} />
              <Path d={`M${Flejos.x - 5},${EJE_Y - 5} L${Flejos.x + 5},${EJE_Y + 5} M${Flejos.x + 5},${EJE_Y - 5} L${Flejos.x - 5},${EJE_Y + 5}`} stroke={UI.texto} strokeWidth={2} />
            </>
          ) : (
            <>
              <Circle cx={Fcerca.x} cy={EJE_Y} r={4.5} fill="none" stroke={UI.texto} strokeWidth={2} />
              <Circle cx={Flejos.x} cy={EJE_Y} r={4.5} fill="none" stroke={UI.texto} strokeWidth={2} />
            </>
          )}

          {/* Lente (elipse azul) */}
          <Ellipse cx={lensX} cy={EJE_Y} rx={8} ry={72} fill="#BFE3FB" stroke={UI.azulOscuro} strokeWidth={3} />

          {/* Objeto (flecha roja arrastrable) */}
          <Line x1={objX} y1={EJE_Y} x2={O.x} y2={O.y} stroke="#E74C3C" strokeWidth={3.5} markerEnd="url(#mR)" />
          <Circle cx={objX} cy={EJE_Y} r={3} fill="#E74C3C" />

          {/* Rayo 1: paralelo al eje */}
          <Line x1={O.x} y1={O.y} x2={lensX} y2={O.y} stroke="#F5A623" strokeWidth={2} />
          <Line
            x1={lensX}
            y1={O.y}
            x2={lensX + (dirRayo1.dx === 0 ? 1 : (dirRayo1.dx / Math.abs(dirRayo1.dx)) * (finX - lensX))}
            y2={O.y + (dirRayo1.dy / Math.abs(dirRayo1.dx || 1)) * (finX - lensX)}
            stroke="#F5A623"
            strokeWidth={2}
            markerEnd="url(#mA)"
          />
          {/* Extensión punteada hacia atrás (imagen virtual) */}
          {!infinito && di < 0 && (
            <Line x1={lensX} y1={O.y} x2={ix} y2={imgTopY} stroke="#F5A623" strokeWidth={1.5} strokeDasharray="5,4" />
          )}

          {/* Rayo 2: pasa por el centro óptico (sin desviarse) */}
          <Line
            x1={O.x}
            y1={O.y}
            x2={infinito || di > 0 ? finX : lensX}
            y2={infinito || di > 0 ? EJE_Y + ((EJE_Y - O.y) / (lensX - O.x)) * (finX - O.x) : EJE_Y}
            stroke="#F5A623"
            strokeWidth={2}
            markerEnd={infinito || di > 0 ? 'url(#mA)' : undefined}
          />
          {!infinito && di < 0 && (
            <Line x1={O.x} y1={O.y} x2={ix} y2={imgTopY} stroke="#F5A623" strokeWidth={1.5} strokeDasharray="5,4" />
          )}

          {/* Rayo 3: pasa por el foco (emerge paralelo) */}
          {dibujarRayo3 && (
            <>
              <Line x1={O.x} y1={O.y} x2={lensX} y2={pFocalY} stroke="#F5A623" strokeWidth={2} />
              <Line x1={lensX} y1={pFocalY} x2={finX} y2={pFocalY} stroke="#F5A623" strokeWidth={2} markerEnd="url(#mA)" />
            </>
          )}

          {/* Imagen */}
          {verImagen &&
            (di > 0 ? (
              <Line x1={ix} y1={EJE_Y} x2={ix} y2={imgTopY} stroke="#2ECC71" strokeWidth={3.5} markerEnd="url(#mV)" />
            ) : (
              <Line x1={ix} y1={EJE_Y} x2={ix} y2={imgTopY} stroke={UI.moradoOscuro} strokeWidth={2.5} strokeDasharray="6,4" />
            ))}
        </Svg>
      </View>

      {/* Tipo de lente */}
      <View style={styles.filaBotones}>
        <Pressable
          onPress={() => setTipo('convergente')}
          style={[styles.tipo, tipo === 'convergente' && styles.tipoActivo]}>
          <Text style={[styles.tipoTexto, tipo === 'convergente' && styles.tipoTextoActivo]}>
            Convergente
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTipo('divergente')}
          style={[styles.tipo, tipo === 'divergente' && styles.tipoActivo]}>
          <Text style={[styles.tipoTexto, tipo === 'divergente' && styles.tipoTextoActivo]}>
            Divergente
          </Text>
        </Pressable>
      </View>

      <Stepper
        etiqueta="Distancia focal (f)"
        valor={`${f} cm`}
        onMenos={() => setF((v) => clamp(v - 1, 6, 20))}
        onMas={() => setF((v) => clamp(v + 1, 6, 20))}
      />

      {/* Lecturas */}
      <View style={styles.lecturas}>
        <Text style={styles.lectura}>
          do = {doi.toFixed(1)} cm · di = {infinito ? '∞' : `${di.toFixed(1)} cm`} · A = {infinito ? '—' : `${Math.abs(m).toFixed(2)}×`}
        </Text>
        <Text style={styles.naturaleza}>{naturaleza}</Text>
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

      <Text style={styles.fuente}>Inspirado en PhET Geometric Optics (Univ. Colorado Boulder)</Text>
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
  ayuda: {
    fontSize: 12,
    color: UI.textoSuave,
    textAlign: 'center',
  },
  lienzo: {
    backgroundColor: UI.fondoCeleste,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: UI.bordeTarjeta,
    overflow: 'hidden',
  },
  filaBotones: {
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  tipo: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 14,
    backgroundColor: UI.fondoVerde,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
  },
  tipoActivo: {
    backgroundColor: UI.azul,
    borderColor: UI.azulOscuro,
  },
  tipoTexto: {
    fontSize: 13,
    fontWeight: '800',
    color: UI.textoSuave,
  },
  tipoTextoActivo: {
    color: '#FFFFFF',
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
    fontSize: 14,
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