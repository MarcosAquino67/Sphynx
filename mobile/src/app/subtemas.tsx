import { useCallback, useState } from 'react';
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeaderUnit } from '@/components/HeaderUnit';
import { LevelNode, type EstadoNivel } from '@/components/LevelNode';
import { SelectorIdioma } from '@/components/SelectorIdioma';
import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { obtenerUnidad, type Nivel, type Subtema } from '@/data/unidades';
import { playClic } from '@/services/sonidos';
import { obtenerCompletadas } from '@/storage/progreso';

/**
 * Pantalla SUBTEMAS: secciones dentro del tema.
 * Cada subtema muestra su cabecera (nombre + progreso) y sus niveles.
 * Al tocar un nivel se abre el menú de acciones
 * (Aprender / Experimentar / Ejercicios) de esa lección.
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

  if (!unidad || unidad.subtemas.length === 0) {
    router.back();
    return null;
  }

  const fondo = unidad.id === 1
    ? require('@/assets/fondo/mecanica_fondo.png')
    : require('@/assets/fondo/optica_fondo.jpg');

  const progresoDe = (sub: Subtema) => {
    const total = sub.niveles.length;
    if (total === 0) return 0;
    const hechas = sub.niveles.filter((n) => completadas.includes(n.leccionId)).length;
    return Math.round((hechas / total) * 100);
  };

  const estadoDe = (sub: Subtema, nivel: Nivel, indice: number): EstadoNivel => {
    if (completadas.includes(nivel.leccionId)) return 'completado';
    const primerPendiente = sub.niveles.findIndex((n) => !completadas.includes(n.leccionId));
    if (indice === primerPendiente) return 'activo';
    return 'bloqueado';
  };

  const abrirNivel = (sub: Subtema, nivel: Nivel, indice: number) => {
    if (estadoDe(sub, nivel, indice) === 'bloqueado') {
      Alert.alert('Bloqueado', `Completá el nivel anterior para desbloquear "${nivel.nombre}".`);
      return;
    }
    playClic();
    router.push(
      {
        pathname: '/unidad',
        params: { unidad: String(unidad.id), subtema: String(sub.id), leccion: String(nivel.leccionId) },
      } as any,
    );
  };

  return (
    <ImageBackground source={fondo} style={styles.fondo} resizeMode="cover">
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <HeaderUnit
            titulo={`Tema:\n${unidad.nombre}`}
            subtitulo={unidad.descripcion_jopara}
            mostrarAtras
            variante="simple"
          />
          <SelectorIdioma />

          {unidad.subtemas.map((sub) => (
            <View key={sub.id} style={styles.seccion}>
              {/* Cabecera del subtema */}
              <View style={[styles.subHeader, { backgroundColor: unidad.color, borderColor: unidad.colorOscuro }]}>
                <View style={styles.iconoCaja}>
                  <MaterialCommunityIcons name={sub.icono} size={28} color={UI.texto} />
                </View>
                <View style={styles.subTextos}>
                  <Text style={styles.subTitulo}>Subtema: {sub.nombre}</Text>
                  <Text style={styles.subDesc}>{sub.descripcion_jopara}</Text>
                  <View style={styles.barraFondo}>
                    <View style={[styles.barraRelleno, { width: `${progresoDe(sub)}%` }]} />
                  </View>
                  <Text style={styles.subProgreso}>{progresoDe(sub)}% completado</Text>
                </View>
              </View>

              {/* Niveles del subtema */}
              <View style={styles.lista}>
                {sub.niveles.map((nivel, i) => {
                  const estado = estadoDe(sub, nivel, i);
                  const bloqueado = estado === 'bloqueado';
                  return (
                    <Pressable
                      key={nivel.leccionId}
                      onPress={() => abrirNivel(sub, nivel, i)}
                      style={[styles.tarjeta, bloqueado && styles.tarjetaBloqueada]}>
                      <LevelNode nivel={nivel.n} estado={estado} tamano={58} />
                      <View style={styles.textos}>
                        <Text style={styles.nivelTitulo}>
                          Nivel {nivel.n}: {nivel.nombre}
                        </Text>
                        <Text style={styles.nivelEstado}>
                          {estado === 'completado'
                            ? '✅ Completado'
                            : estado === 'activo'
                              ? '▶ ¡Nde turno!'
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
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
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
  seccion: {
    width: '100%',
    marginTop: Spacing.three,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: RADIO_TARJETA,
    borderWidth: 2,
    padding: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  iconoCaja: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTextos: {
    flex: 1,
    gap: 3,
  },
  subTitulo: {
    fontSize: 16,
    fontWeight: '900',
    color: UI.texto,
  },
  subDesc: {
    fontSize: 12,
    fontStyle: 'italic',
    color: UI.texto,
    opacity: 0.75,
  },
  barraFondo: {
    marginTop: 3,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    overflow: 'hidden',
  },
  barraRelleno: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: UI.texto,
  },
  subProgreso: {
    fontSize: 11,
    fontWeight: '800',
    color: UI.texto,
    opacity: 0.8,
  },
  lista: {
    gap: Spacing.two,
    marginTop: Spacing.two,
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
  nivelTitulo: {
    fontSize: 15,
    fontWeight: '800',
    color: UI.texto,
  },
  nivelEstado: {
    fontSize: 12,
    fontWeight: '700',
    color: UI.textoSuave,
  },
  mascota: {
    marginTop: Spacing.four,
  },
});