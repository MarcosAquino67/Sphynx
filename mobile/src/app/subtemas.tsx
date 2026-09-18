import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeaderUnit } from '@/components/HeaderUnit';
import { LevelNode, type EstadoNivel } from '@/components/LevelNode';
import { RobotSaludo } from '@/components/RobotSaludo';
import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { obtenerUnidad, type Nivel } from '@/data/unidades';
import { obtenerCompletadas } from '@/storage/progreso';

/**
 * Pantalla SUBTEMAS: menú extra dentro de un tema.
 * Lista los subtemas (niveles) de la unidad con su estado
 * (completado / activo / bloqueado). Al tocar uno se abre el
 * menú de acciones (Aprender / Experimentar / Ejercicios).
 */
export default function SubtemasScreen() {
  const params = useLocalSearchParams<{ unidad?: string }>();
  const unidad = obtenerUnidad(Number(params.unidad ?? 1));

  const [completadas, setCompletadas] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      obtenerCompletadas().then(setCompletadas);
    }, []),
  );

  if (!unidad || unidad.niveles.length === 0) {
    router.back();
    return null;
  }

  const primerPendiente = unidad.niveles.findIndex((n) => !completadas.includes(n.leccionId));

  const estadoDe = (nivel: Nivel, indice: number): EstadoNivel => {
    if (completadas.includes(nivel.leccionId)) return 'completado';
    if (indice === primerPendiente) return 'activo';
    return 'bloqueado';
  };

  const abrirSubtema = (nivel: Nivel, indice: number) => {
    if (estadoDe(nivel, indice) === 'bloqueado') {
      Alert.alert('Bloqueado', `Completá el subtema anterior para desbloquear "${nivel.nombre}".`);
      return;
    }
    router.push(
      { pathname: '/unidad', params: { unidad: String(unidad.id), leccion: String(nivel.leccionId) } } as any,
    );
  };

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <HeaderUnit
            titulo={`Tema:\n${unidad.nombre}`}
            subtitulo={unidad.descripcion_jopara}
            mostrarAtras
            variante="simple"
          />

          <View style={styles.lista}>
            {unidad.niveles.map((nivel, i) => {
              const estado = estadoDe(nivel, i);
              const bloqueado = estado === 'bloqueado';
              return (
                <Pressable
                  key={nivel.leccionId}
                  onPress={() => abrirSubtema(nivel, i)}
                  style={[styles.tarjeta, bloqueado && styles.tarjetaBloqueada]}>
                  <LevelNode nivel={nivel.n} estado={estado} tamano={58} />
                  <View style={styles.textos}>
                    <Text style={styles.subtemaTitulo}>
                      Subtema {nivel.n}: {nivel.nombre}
                    </Text>
                    <Text style={styles.subtemaEstado}>
                      {estado === 'completado'
                        ? '✅ Completado'
                        : estado === 'activo'
                          ? '▶ ¡Te toca este!'
                          : '🔒 Bloqueado'}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={26}
                    color={bloqueado ? UI.iconoInactivo : unidad.colorOscuro}
                  />
                </Pressable>
              );
            })}
          </View>

          <RobotSaludo imagen={unidad.mascota} ancho={140} alto={140} style={styles.mascota} />
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
  contenido: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
  lista: {
    width: '100%',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: UI.tarjeta,
    borderRadius: RADIO_TARJETA,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    padding: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tarjetaBloqueada: {
    opacity: 0.75,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  subtemaTitulo: {
    fontSize: 15,
    fontWeight: '800',
    color: UI.texto,
  },
  subtemaEstado: {
    fontSize: 12,
    fontWeight: '700',
    color: UI.textoSuave,
  },
  mascota: {
    marginTop: Spacing.four,
  },
});