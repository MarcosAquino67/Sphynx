import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button3D } from '@/components/Button3D';
import { HeaderUnit } from '@/components/HeaderUnit';
import { Spacing, UI } from '@/constants/theme';
import { useIdioma, useTraduccion } from '@/context/IdiomaContext';
import { obtenerSubtema, obtenerUnidad } from '@/data/unidades';

/**
 * Pantalla ACCIONES DEL NIVEL.
 * Se llega desde un nivel: muestra su nombre y los 3 botones 3D
 * (Aprender / Experimentar-Jugar / Ejercicios) aplicados a esa lección.
 */
export default function UnidadScreen() {
  const params = useLocalSearchParams<{ unidad?: string; subtema?: string; leccion?: string }>();
  const unidad = obtenerUnidad(Number(params.unidad ?? 1));
  const sub = unidad && obtenerSubtema(unidad.id, Number(params.subtema ?? unidad.subtemas[0]?.id ?? 1));

  if (!unidad || !sub) {
    router.back();
    return null;
  }

  const nivel = sub.niveles.find((n) => n.leccionId === Number(params.leccion)) ?? sub.niveles[0];
  const leccionId = nivel?.leccionId;
  const { idioma, setIdioma } = useIdioma();
  const t = useTraduccion();
  const fondo = unidad.id === 1
    ? require('@/assets/fondo/mecanica_fondo.png')
    : require('@/assets/fondo/optica_fondo.jpg');

  return (
    <ImageBackground source={fondo} style={styles.fondo} resizeMode="cover">
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <HeaderUnit
            titulo={nivel ? `Nivel:\n${nivel.nombre}` : `Subtema:\n${sub.nombre}`}
            subtitulo={sub.nombre}
            mostrarAtras
            variante="simple"
          />
          <Pressable onPress={() => setIdioma(idioma === 'es' ? 'jopara' : 'es')} style={styles.idiomaPill}>
            <Text style={styles.idiomaTexto}>{idioma === 'es' ? 'ES → JOPARA' : 'JOPARA → ES'}</Text>
          </Pressable>

          <View style={styles.botones}>
            <Button3D
              titulo={t('unidad.aprender')}
              icono="book-open-variant"
              color={UI.naranja}
              colorBorde={UI.naranjaOscuro}
              onPress={() =>
                router.push(
                  { pathname: '/teoria', params: { unidad: String(unidad.id), subtema: String(sub.id) } } as any,
                )
              }
              style={styles.boton}
            />
            <Button3D
              titulo={t('unidad.experimentar')}
              icono="flask"
              color={UI.azul}
              colorBorde={UI.azulOscuro}
              onPress={() =>
                router.push({ pathname: '/experimento', params: { unidad: String(unidad.id) } } as any)
              }
              style={styles.boton}
            />
            <Button3D
              titulo={t('unidad.ejercicios')}
              icono="pencil"
              color={UI.verde}
              colorBorde={UI.verdeOscuro}
              onPress={() =>
                router.push(
                  { pathname: '/niveles', params: { unidad: String(unidad.id), subtema: String(sub.id) } } as any,
                )
              }
              style={styles.boton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
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
    marginTop: Spacing.two,
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    borderRadius: 16,
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
    alignSelf: 'center',
  },
  idiomaTexto: {
    fontSize: 12,
    fontWeight: '800',
    color: UI.texto,
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