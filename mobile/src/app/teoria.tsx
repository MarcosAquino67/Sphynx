import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button3D } from '@/components/Button3D';
import { MascotContainer } from '@/components/MascotContainer';
import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { obtenerUnidad } from '@/data/unidades';

/**
 * Pantalla TEORÍA (mockup "TEORÍA").
 * Tarjeta blanca grande con ilustración (mascota), título, explicación
 * y botón 3D EJERCICIOS que lleva al mapa de niveles.
 */
export default function TeoriaScreen() {
  const params = useLocalSearchParams<{ unidad?: string }>();
  const unidad = obtenerUnidad(Number(params.unidad ?? 1));

  if (!unidad) {
    router.back();
    return null;
  }

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <Text style={styles.titulo}>TEORÍA</Text>

          {/* Tarjeta blanca con ilustración + concepto */}
          <View style={styles.tarjeta}>
            <MascotContainer
              imagen={unidad.mascota}
              ancho={170}
              alto={170}
              conMarco={false}
            />
            <Text style={styles.tarjetaTitulo}>{unidad.teoriaTitulo}</Text>
            <Text style={styles.tarjetaTexto}>{unidad.teoriaTexto}</Text>
          </View>

          <Button3D
            titulo="EJERCICIOS"
            icono="pencil"
            color={unidad.color}
            colorBorde={unidad.colorOscuro}
            onPress={() =>
              router.push({ pathname: '/niveles', params: { unidad: String(unidad.id) } } as any)
            }
            style={styles.boton}
          />

          <Pressable onPress={() => router.back()} style={styles.backPage}>
            <Text style={styles.backPageTexto}>Back page</Text>
          </Pressable>
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
  },
  titulo: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2,
    color: UI.texto,
  },
  tarjeta: {
    width: '100%',
    marginTop: Spacing.three,
    backgroundColor: UI.tarjeta,
    borderRadius: RADIO_TARJETA,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  tarjetaTitulo: {
    fontSize: 22,
    fontWeight: '900',
    color: UI.texto,
    textAlign: 'center',
  },
  tarjetaTexto: {
    fontSize: 15,
    lineHeight: 23,
    color: UI.texto,
    textAlign: 'center',
  },
  boton: {
    width: '100%',
    marginTop: Spacing.four,
  },
  backPage: {
    marginTop: Spacing.three,
    backgroundColor: UI.tarjeta,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: UI.bordeTarjeta,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  backPageTexto: {
    fontSize: 13,
    color: UI.textoSuave,
  },
});