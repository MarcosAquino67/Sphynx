import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button3D } from '@/components/Button3D';
import { HeaderUnit } from '@/components/HeaderUnit';
import { RobotSaludo } from '@/components/RobotSaludo';
import { Spacing, UI } from '@/constants/theme';
import { obtenerUnidad } from '@/data/unidades';

/**
 * Pantalla ACCIONES DEL SUBTEMA (ex menú de unidad).
 * Se llega desde un subtema: muestra su nombre y los 3 botones 3D
 * (Aprender / Experimentar-Jugar / Ejercicios) aplicados a esa lección.
 */
export default function UnidadScreen() {
  const params = useLocalSearchParams<{ id?: string; unidad?: string; leccion?: string }>();
  const unidad = obtenerUnidad(Number(params.unidad ?? params.id ?? 1));

  if (!unidad) {
    router.back();
    return null;
  }

  const nivel = unidad.niveles.find((n) => n.leccionId === Number(params.leccion)) ?? unidad.niveles[0];

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <HeaderUnit
            titulo={nivel ? `Subtema:\n${nivel.nombre}` : `Tema:\n${unidad.nombre}`}
            subtitulo={unidad.nombre}
            mostrarAtras
            variante="simple"
          />

          <View style={styles.botones}>
            <Button3D
              titulo="Aprender"
              icono="book-open-variant"
              color={UI.naranja}
              colorBorde={UI.naranjaOscuro}
              onPress={() =>
                router.push({ pathname: '/teoria', params: { unidad: String(unidad.id) } } as any)
              }
              style={styles.boton}
            />
            <Button3D
              titulo="Experimentar (Jugar)"
              icono="flask"
              color={UI.azul}
              colorBorde={UI.azulOscuro}
              onPress={() =>
                router.push({ pathname: '/experimento', params: { unidad: String(unidad.id) } } as any)
              }
              style={styles.boton}
            />
            <Button3D
              titulo="Ejercicios"
              icono="pencil"
              color={UI.verde}
              colorBorde={UI.verdeOscuro}
              onPress={() =>
                router.push({ pathname: '/niveles', params: { unidad: String(unidad.id) } } as any)
              }
              style={styles.boton}
            />
          </View>

          <RobotSaludo imagen={unidad.mascota} ancho={210} alto={210} style={styles.mascota} />
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
  botones: {
    width: '100%',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  boton: {
    width: '100%',
  },
  mascota: {
    marginTop: Spacing.four,
  },
});