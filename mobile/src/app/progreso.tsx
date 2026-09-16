import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button3D } from '@/components/Button3D';
import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { useUserProgress } from '@/hooks/use-user-progress';
import { obtenerCompletadas } from '@/storage/progreso';

/**
 * Pantalla PROGRESO: racha de días y lecciones completadas.
 * Los datos viven en AsyncStorage (offline-first).
 */
export default function ProgresoScreen() {
  const { streak } = useUserProgress();
  const [completadas, setCompletadas] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      obtenerCompletadas().then(setCompletadas);
    }, []),
  );

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <Text style={styles.titulo}>Tu Progreso</Text>
          <Text style={styles.subtitulo}>Petetĩ ára haipytereíva, petetĩ jehupity</Text>

          {/* Tarjeta de racha */}
          <View style={styles.tarjeta}>
            <MaterialCommunityIcons name="fire" size={54} color={UI.naranja} />
            <Text style={styles.numeroGrande}>{streak}</Text>
            <Text style={styles.etiqueta}>días de racha</Text>
          </View>

          {/* Tarjeta de lecciones */}
          <View style={styles.tarjeta}>
            <MaterialCommunityIcons name="medal" size={40} color={UI.verde} />
            <Text style={styles.numeroGrande}>{completadas.length}</Text>
            <Text style={styles.etiqueta}>lecciones listas</Text>
          </View>

          <Button3D
            titulo="Seguir aprendiendo"
            icono="play"
            color={UI.verde}
            colorBorde={UI.verdeOscuro}
            onPress={() => router.replace('/' as any)}
            style={styles.boton}
          />
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
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '900',
    color: UI.texto,
  },
  subtitulo: {
    fontSize: 13,
    fontStyle: 'italic',
    color: UI.textoSuave,
  },
  tarjeta: {
    width: '100%',
    backgroundColor: UI.tarjeta,
    borderRadius: RADIO_TARJETA,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    padding: Spacing.four,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  numeroGrande: {
    fontSize: 44,
    fontWeight: '900',
    color: UI.texto,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '700',
    color: UI.textoSuave,
  },
  boton: {
    width: '100%',
    marginTop: Spacing.two,
  },
});