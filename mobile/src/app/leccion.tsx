import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Button3D } from '@/components/Button3D';
import { RobotSaludo } from '@/components/RobotSaludo';
import { PREGUNTAS_FISICA } from '@/data/preguntas';
import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { useUserProgress } from '@/hooks/use-user-progress';
import { marcarCompletada } from '@/storage/progreso';
import { UNIDADES } from '@/data/unidades';

const LETRAS = ['A', 'B', 'C', 'D'];
const IDIOMA_KEY = '@sphynx/idioma';

function tituloLeccion(id: number) {
  for (const unidad of UNIDADES) {
    const nivel = unidad.niveles.find((n) => n.leccionId === id);
    if (nivel) return nivel.nombre;
  }
  return 'Lección';
}

/**
 * Pantalla de EJERCICIO (pregunta + opciones A-D).
 * Burbuja de diálogo con la mascota, botones chunky de opción múltiple,
 * explicación en jopara y guardado de racha/corazones/progreso.
 */
export default function LeccionScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const leccionId = Number(params.id ?? 1);
  const preguntas = PREGUNTAS_FISICA.filter((p) => p.leccion_id === leccionId);

  const [indice, setIndice] = useState(0);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [idioma, setIdioma] = useState<'es' | 'jopara'>('es');
  const { hearts, perderCorazon, registrarRacha } = useUserProgress();

  // Idioma guardado en Ajustes como valor inicial
  useEffect(() => {
    AsyncStorage.getItem(IDIOMA_KEY).then((v) => {
      if (v === 'jopara') setIdioma('jopara');
    });
  }, []);

  if (preguntas.length === 0) {
    return (
      <View style={[styles.fondo, styles.centro]}>
        <Text style={styles.sinPreguntas}>Sin preguntas aún</Text>
        <Button3D titulo="Volver" color={UI.azul} colorBorde={UI.azulOscuro} onPress={() => router.back()} />
      </View>
    );
  }

  const pregunta = preguntas[indice];
  const titulo = tituloLeccion(leccionId);
  const respondio = seleccion !== null;
  const esCorrecta = seleccion === pregunta.respuesta_correcta;
  const textoPregunta = idioma === 'es' ? pregunta.pregunta_es : pregunta.pregunta_jopara;

  const responder = (opcion: string) => {
    if (respondio) return;
    setSeleccion(opcion);
    if (opcion !== pregunta.respuesta_correcta) {
      perderCorazon();
      if (hearts - 1 <= 0) {
        Alert.alert('💔 Sin corazones', '¡Descansá y volvé mañana para seguir aprendiendo!');
        router.back();
      }
    }
  };

  const siguiente = () => {
    if (indice + 1 < preguntas.length) {
      setIndice((i) => i + 1);
      setSeleccion(null);
      return;
    }
    marcarCompletada(leccionId);
    registrarRacha();
    Alert.alert('🎉 ¡Lección completada!', '¡Apañá! Tu racha de estudio creció hoy.');
    router.back();
  };

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <AppHeader />

        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <View style={styles.bannerFila}>
            <View style={styles.banner}>
              <Text style={styles.bannerTexto}>
                Lección {leccionId}: {titulo}
              </Text>
            </View>
            <Pressable
              style={styles.idiomaPill}
              onPress={() => setIdioma(idioma === 'es' ? 'jopara' : 'es')}>
              <Text style={styles.idiomaTexto}>
                {idioma === 'es' ? '🇵🇾 Jopara' : '🇪🇸 Español'}
              </Text>
            </Pressable>
          </View>

          {/* Burbuja de pregunta con la mascota */}
          <View style={styles.preguntaZona}>
            <RobotSaludo
              imagen={require('@/assets/mascotas/gato-calculadora.jpeg')}
              ancho={104}
              alto={104}
              conMarco={false}
              style={styles.catWrap}
            />
            <View style={styles.burbuja}>
              <Text style={styles.preguntaTexto}>{textoPregunta}</Text>
            </View>
          </View>

          {/* Opciones A-D estilo chunky */}
          <View style={styles.opciones}>
            {pregunta.opciones.map((opcion, i) => {
              const esLaCorrecta = respondio && opcion === pregunta.respuesta_correcta;
              const esLaElegida = seleccion === opcion;
              return (
                <Pressable
                  key={opcion}
                  onPress={() => responder(opcion)}
                  disabled={respondio}
                  style={[
                    styles.opcion,
                    respondio && !esLaCorrecta && !esLaElegida && styles.opcionApagada,
                    esLaCorrecta && styles.opcionCorrecta,
                    esLaElegida && !esLaCorrecta && styles.opcionIncorrecta,
                  ]}>
                  <Text style={styles.opcionTexto}>
                    {LETRAS[i]}) {opcion}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {respondio && (
            <View style={styles.feedback}>
              <Text style={styles.feedbackTitulo}>
                {esCorrecta ? '✅ ¡Epeichapo! Correcto' : '❌ Error... ¡Eñemoarandu!'}
              </Text>
              <Text style={styles.feedbackTexto}>{pregunta.explicacion_jopara}</Text>
              <Button3D
                titulo={indice + 1 < preguntas.length ? 'Siguiente' : 'Finalizar'}
                color={esCorrecta ? UI.verde : UI.rojo}
                colorBorde={esCorrecta ? UI.verdeOscuro : UI.rojoOscuro}
                onPress={siguiente}
              />
            </View>
          )}
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
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  sinPreguntas: {
    fontSize: 20,
    fontWeight: '800',
    color: UI.texto,
  },
  contenido: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  bannerFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  banner: {
    backgroundColor: UI.texto,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
  },
  bannerTexto: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  idiomaPill: {
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
  preguntaZona: {
    width: '100%',
    marginTop: Spacing.three,
  },
  catWrap: {
    alignSelf: 'flex-end',
    marginRight: Spacing.two,
    marginBottom: -30,
    zIndex: 2,
  },
  burbuja: {
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    borderRadius: RADIO_TARJETA,
    padding: Spacing.three,
    paddingTop: Spacing.four,
    minHeight: 120,
    zIndex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  preguntaTexto: {
    color: UI.texto,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
  },
  opciones: {
    width: '100%',
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
  opcion: {
    width: '100%',
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    borderBottomWidth: 6,
    borderBottomColor: '#C4D6CB',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: Spacing.four,
  },
  opcionApagada: {
    opacity: 0.5,
  },
  opcionCorrecta: {
    borderColor: UI.verdeOscuro,
    borderBottomColor: UI.verdeOscuro,
    backgroundColor: '#E9F9EF',
  },
  opcionIncorrecta: {
    borderColor: UI.rojoOscuro,
    borderBottomColor: UI.rojoOscuro,
    backgroundColor: '#FDEDEC',
  },
  opcionTexto: {
    color: UI.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  feedback: {
    width: '100%',
    marginTop: Spacing.four,
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    borderRadius: RADIO_TARJETA,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  feedbackTitulo: {
    fontSize: 16,
    fontWeight: '900',
    color: UI.texto,
  },
  feedbackTexto: {
    fontSize: 14,
    lineHeight: 20,
    color: UI.textoSuave,
  },
});