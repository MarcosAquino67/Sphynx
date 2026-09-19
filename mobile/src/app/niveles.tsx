import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Button3D } from '@/components/Button3D';
import { LevelNode, type EstadoNivel } from '@/components/LevelNode';
import { MaxContentWidth, RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { obtenerSubtema, obtenerUnidad, type Nivel } from '@/data/unidades';
import { obtenerCompletadas } from '@/storage/progreso';

const NODO = 76;
const PASO_Y = 152;
const LINEA = '#D9E6DD';

/** Posiciones del centro del nodo (fracción del ancho): zig-zag alternado. */
const POSICIONES = [0.2, 0.5, 0.8, 0.5];

function fraccionX(i: number) {
  return POSICIONES[i % POSICIONES.length];
}

/** Curva suave (Catmull-Rom → Bézier) que une todos los centros. */
function caminoSuave(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x},${p2.y}`;
  }
  return d;
}

function estadoDe(nivel: Nivel, completadas: number[], indicePrimerPendiente: number, indice: number): EstadoNivel {
  if (completadas.includes(nivel.leccionId)) return 'completado';
  if (indice === indicePrimerPendiente) return 'activo';
  return 'bloqueado';
}

/**
 * Pantalla MAPA DE NIVELES (mockup "Ejercicios").
 * ScrollView vertical con camino en zig-zag de nodos metálicos.
 * Abajo: panel "Selección" + botón 3D Empezar que abre la lección.
 */
export default function NivelesScreen() {
  const params = useLocalSearchParams<{ unidad?: string; subtema?: string }>();
  const unidad = obtenerUnidad(Number(params.unidad ?? 1));
  const sub = unidad && obtenerSubtema(unidad.id, Number(params.subtema ?? unidad.subtemas[0]?.id ?? 1));
  const { width } = useWindowDimensions();

  const [completadas, setCompletadas] = useState<number[]>([]);
  const [seleccionado, setSeleccionado] = useState(0);

  useFocusEffect(
    useCallback(() => {
      obtenerCompletadas().then(setCompletadas);
    }, []),
  );

  if (!unidad || !sub || sub.niveles.length === 0) {
    router.back();
    return null;
  }

  const niveles = sub.niveles;
  const ancho = Math.min(width, MaxContentWidth) - Spacing.four * 2;
  const primerPendiente = niveles.findIndex((n) => !completadas.includes(n.leccionId));
  const indiceActivo = primerPendiente === -1 ? niveles.length - 1 : primerPendiente;
  const nivelSel = niveles[Math.min(seleccionado, niveles.length - 1)];
  const centros = niveles.map((_, i) => ({
    cx: fraccionX(i) * ancho,
    cy: i * PASO_Y + PASO_Y / 2,
  }));

  const tocarNodo = (nivel: Nivel, indice: number) => {
    const estado = estadoDe(nivel, completadas, indiceActivo, indice);
    if (estado === 'bloqueado') {
      Alert.alert('Bloqueado', `Completá el nivel anterior para desbloquear "${nivel.nombre}".`);
      return;
    }
    setSeleccionado(indice);
  };

  const empezar = () => {
    router.push({ pathname: '/leccion', params: { id: String(nivelSel.leccionId) } } as any);
  };

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        {/* Cabecera: pills Ejercicios + TEMA + atrás */}
        <View style={styles.cabecera}>
          <Pressable onPress={() => router.back()} style={styles.atras}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#FFFFFF" />
          </Pressable>
          <View style={styles.pildora}>
            <Text style={styles.pildoraTexto}>Ejercicios</Text>
          </View>
          <View style={styles.pildora}>
            <Text style={styles.pildoraTexto}>TEMA: {sub.nombre}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          {/* Camino curvo continuo que une los nodos */}
          <View style={[styles.camino, { height: niveles.length * PASO_Y + 60, width: ancho }]}>
            <Svg width={ancho} height={niveles.length * PASO_Y + 60}>
              <Path
                d={caminoSuave(centros.map((c) => ({ x: c.cx, y: c.cy })))}
                fill="none"
                stroke={LINEA}
                strokeWidth={6}
                strokeLinecap="round"
              />
            </Svg>
            {niveles.map((nivel, i) => (
              <View
                key={nivel.leccionId}
                style={{
                  position: 'absolute',
                  left: centros[i].cx - NODO / 2,
                  top: centros[i].cy - NODO / 2,
                }}>
                <LevelNode
                  nivel={nivel.n}
                  estado={estadoDe(nivel, completadas, indiceActivo, i)}
                  etiqueta={nivel.nombre}
                  tamano={NODO}
                  fondoEtiqueta={UI.fondoVerde}
                  onPress={() => tocarNodo(nivel, i)}
                />
              </View>
            ))}
          </View>

          {/* Panel inferior de selección */}
          <View style={styles.panel}>
            <View style={styles.seleccion}>
              <Text style={styles.seleccionTitulo}>Selección</Text>
              <Text style={styles.seleccionNivel}>
                ⭐ Niv. {nivelSel.n} ⭐{'\n'}
                {nivelSel.nombre}
              </Text>
            </View>
            <Button3D
              titulo="Empezar"
              icono="play"
              color={UI.verde}
              colorBorde={UI.verdeOscuro}
              onPress={empezar}
              style={styles.botonEmpezar}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: UI.fondoVerde,
  },
  safe: {
    flex: 1,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  atras: {
    width: 44,
    height: 36,
    borderRadius: 12,
    backgroundColor: UI.rojo,
    borderWidth: 2,
    borderColor: UI.rojoOscuro,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pildora: {
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
  },
  pildoraTexto: {
    fontSize: 13,
    fontWeight: '800',
    color: UI.texto,
  },
  contenido: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  camino: {
    position: 'relative',
    marginTop: Spacing.two,
    alignSelf: 'center',
  },
  panel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    width: '100%',
    marginTop: Spacing.three,
    backgroundColor: UI.tarjeta,
    borderRadius: RADIO_TARJETA,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    padding: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  seleccion: {
    flex: 1,
    alignItems: 'center',
  },
  seleccionTitulo: {
    fontSize: 15,
    fontWeight: '900',
    color: UI.texto,
  },
  seleccionNivel: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
    color: UI.textoSuave,
    textAlign: 'center',
  },
  botonEmpezar: {
    flex: 1.2,
  },
});