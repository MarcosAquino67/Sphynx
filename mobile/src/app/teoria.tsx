import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button3D } from '@/components/Button3D';
import { RobotSaludo } from '@/components/RobotSaludo';
import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { obtenerSubtema, obtenerUnidad } from '@/data/unidades';

/**
 * Pantalla TEORÍA (mockup "TEORÍA").
 * Tarjeta blanca grande con ilustración (mascota), título, explicación
 * y botón 3D EJERCICIOS que lleva al mapa de niveles.
 */
export default function TeoriaScreen() {
  const params = useLocalSearchParams<{ unidad?: string; subtema?: string }>();
  const unidad = obtenerUnidad(Number(params.unidad ?? 1));
  const sub = unidad && obtenerSubtema(unidad.id, Number(params.subtema ?? unidad.subtemas[0]?.id ?? 1));
  const [idioma, setIdioma] = useState<'es' | 'jopara'>('es');

  if (!unidad || !sub) {
    router.back();
    return null;
  }

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <Text style={styles.titulo}>TEORÍA</Text>
          <Pressable
            style={styles.idiomaPill}
            onPress={() => setIdioma(idioma === 'es' ? 'jopara' : 'es')}>
            <Text style={styles.idiomaTexto}>
              {idioma === 'es' ? '🇵🇾 Jopara' : '🇪🇸 Español'}
            </Text>
          </Pressable>

          {/* Tarjeta blanca con ilustración + concepto */}
          <View style={styles.tarjeta}>
            <RobotSaludo
              imagen={sub.mascota}
              ancho={170}
              alto={170}
              conMarco={false}
            />
            <Text style={styles.tarjetaTitulo}>{sub.teoriaTitulo}</Text>
            <Text style={styles.tarjetaTexto}>
              {idioma === 'es' ? sub.teoriaTexto : sub.teoria_jopara}
            </Text>
            <Text style={styles.fuente}>Fuente: Cuadernillo MEC · Física 3er curso</Text>
          </View>

          <Button3D
            titulo="EJERCICIOS"
            icono="pencil"
            color={unidad.color}
            colorBorde={unidad.colorOscuro}
            onPress={() =>
              router.push(
                { pathname: '/niveles', params: { unidad: String(unidad.id), subtema: String(sub.id) } } as any,
              )
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
  idiomaPill: {
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
  fuente: {
    fontSize: 11,
    fontStyle: 'italic',
    color: UI.textoSuave,
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