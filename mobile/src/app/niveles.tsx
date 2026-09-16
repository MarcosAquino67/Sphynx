import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button3D } from '@/components/Button3D';
import { LevelNode, type EstadoNivel } from '@/components/LevelNode';
import { MaxContentWidth, RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { obtenerUnidad, type Nivel } from '@/data/unidades';
import { obtenerCompletadas } from '@/storage/progreso';

const NODO = 76;
const PASO_Y = 128;
const LINEA = '#D9E6DD';

/** Posición horizontal del nodo i: onda seno para el zig-zag (fracción del ancho). */
function fraccionX(i: number) {
  return 0.5 + 0.32 * Math.sin(i * 0.95);
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
  const params = useLocalSearchParams<{ unidad?: string }>();
  const unidad = obtenerUnidad(Number(params.unidad ?? 1));
  const { width } = useWindowDimensions();

  const [completadas, setCompletadas] = useState<number[]>([]);
  const [seleccionado, setSeleccionado] = useState(0);

  useFocusEffect(
    useCallback(() => {
      obtenerCompletadas().then(setCompletadas);
    }, []),
  );

  if (!unidad || unidad.niveles.length === 0) {
    router.back();
    return null;
  }

  const niveles = unidad.niveles;
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
            <MaterialCommunityIcons name="chevron-left" size={24} color={UI.texto} />
          </Pressable>
          <View style={styles.pildora}>
            <Text style={styles.pildoraTexto}>Ejercicios</Text>
          </View>
          <View style={styles.pildora}>
            <Text style={styles.pildoraTexto}>TEMA: {unidad.nombre}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          {/* Camino en zig-zag */}
          <View style={[styles.camino, { height: niveles.length * PASO_Y, width: ancho }]}>
            {niveles.map((nivel, i) => {
              if (i === niveles.length - 1) return null;
              const a = centros[i];
              const b = centros[i + 1];
              const dx = b.cx - a.cx;
              const largo = Math.sqrt(dx * dx + PASO_Y * PASO_Y);
              const angulo = (Math.atan2(dx, PASO_Y) * 180) / Math.PI;
              return (
                <View
                  key={`c-${nivel.leccionId}`}
                  style={[
                    styles.conector,
                    {
                      left: (a.cx + b.cx) / 2 - largo / 2,
                      top: a.cy + PASO_Y / 2 - 2,
                      width: largo,
                      transform: [{ rotate: `${angulo}deg` }],
                    },
                  ]}
                />
              );
            })}
            {niveles.map((nivel, i) => (
              <View
                key={nivel.leccionId}
                style={{
                  position: 'absolute',
                  left: centros[i].cx - NODO / 2,
                  top: centros[i].cy - NODO / 2,
                  opacity: i === Math.min(seleccionado, niveles.length - 1) ? 1 : 0.92,
                }}>
                <LevelNode
                  nivel={nivel.n}
                  estado={estadoDe(nivel, completadas, indiceActivo, i)}
                  etiqueta={nivel.nombre}
                  tamano={NODO}
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
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
  conector: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    backgroundColor: LINEA,
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