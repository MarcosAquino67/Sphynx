import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeaderUnit } from '@/components/HeaderUnit';
import { SimuladorLentes } from '@/components/SimuladorLentes';
import { SimuladorMCU } from '@/components/SimuladorMCU';
import { Spacing, UI } from '@/constants/theme';
import { useIdioma } from '@/context/IdiomaContext';
import { obtenerUnidad } from '@/data/unidades';

/**
 * Pantalla EXPERIMENTAR: laboratorio interactivo del tema.
 * - Unidad 1 (Movimiento Circular) → simulador circular con R y ω.
 * - Unidad 2 (Lentes) → simulador de lentes arrastrables con rayos.
 * Se llega desde el botón "Experimentar (Jugar)" del subtema.
 */
export default function ExperimentoScreen() {
  const params = useLocalSearchParams<{ unidad?: string }>();
  const { idioma, setIdioma } = useIdioma();
  const unidad = obtenerUnidad(Number(params.unidad ?? 1));

  if (!unidad) {
    router.back();
    return null;
  }

  const esLentes = unidad.id === 2;

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <HeaderUnit
            titulo={`Experimentar:\n${unidad.nombre}`}
            subtitulo="Tocá, arrastrá y probá valores"
            mostrarAtras
            variante="simple"
          />
          <Pressable onPress={() => setIdioma(idioma === 'es' ? 'jopara' : 'es')} style={styles.idiomaPill}>
            <Text style={styles.idiomaTexto}>{idioma === 'es' ? 'ES → JOPARA' : 'JOPARA → ES'}</Text>
          </Pressable>
          <View style={styles.sim}>
            {esLentes ? <SimuladorLentes /> : <SimuladorMCU />}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: UI.fondoCeleste,
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
  idiomaPill: {
    alignSelf: 'center',
    marginTop: Spacing.two,
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    borderRadius: 16,
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
  },
  idiomaTexto: {
    fontSize: 12,
    fontWeight: '800',
    color: UI.texto,
  },
  sim: {
    width: '100%',
    marginTop: Spacing.three,
  },
});