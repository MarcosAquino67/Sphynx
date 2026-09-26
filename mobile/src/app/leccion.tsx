import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Button3D } from '@/components/Button3D';
import { RobotSaludo } from '@/components/RobotSaludo';
import { SelectorIdioma } from '@/components/SelectorIdioma';
import { TextoFormateado } from '@/components/TextoFormateado';
import { PREGUNTAS_FISICA } from '@/data/preguntas';
import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { useIdioma, useTraduccion } from '@/context/IdiomaContext';
import { useUserProgress } from '@/hooks/use-user-progress';
import { marcarCompletada } from '@/storage/progreso';
import { registrarRespuesta } from '@/storage/estadisticas';
import { playAcierto, playCuestionario, playError, stopCuestionario } from '@/services/sonidos';
import { nombreLeccion, numeroLeccion } from '@/data/unidades';

const LETRAS = ['A', 'B', 'C', 'D'];

function tituloLeccion(id: number) {
  return nombreLeccion(id);
}

/**
 * Pantalla de EJERCICIO (pregunta + opciones A-D).
 * Burbuja de diálogo con la mascota, botones chunky de opción múltiple,
 * explicación en jopara y guardado de racha/progreso.
 */
export default function LeccionScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const leccionId = Number(params.id ?? 1);
  const preguntas = PREGUNTAS_FISICA.filter((p) => p.leccion_id === leccionId);

  const [indice, setIndice] = useState(0);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [aciertosNivel, setAciertosNivel] = useState(0);
  const [mostrarInforme, setMostrarInforme] = useState(false);
  const [progresoPct, setProgresoPct] = useState(0);
  const { idioma } = useIdioma();
  const t = useTraduccion();
  const { registrarRacha } = useUserProgress();
  const insets = useSafeAreaInsets();

  // Cuestionario suena con cuestionario.mp3
  useEffect(() => {
    playCuestionario();
    return () => {
      stopCuestionario();
    };
  }, []);

  if (preguntas.length === 0) {
    return (
      <View style={[styles.fondo, styles.centro]}>
        <Text style={styles.sinPreguntas}>{t('leccion.sinPreguntas')}</Text>
        <Button3D titulo={t('leccion.volver')} color={UI.azul} colorBorde={UI.azulOscuro} onPress={() => router.back()} />
      </View>
    );
  }

  const pregunta = preguntas[indice];
  const titulo = tituloLeccion(leccionId);
  const respondio = seleccion !== null;
  const esCorrecta = seleccion === pregunta.respuesta_correcta;
  const textoPregunta = idioma === 'es' ? pregunta.pregunta_es : pregunta.pregunta_jopara;

  // Aleatoriza el orden de las opciones en cada pregunta (la correcta no siempre es A)
  const opcionesMezcladas = useMemo(() => {
    const arr = [...pregunta.opciones];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [pregunta.id]);

  const responder = (opcion: string) => {
    if (respondio) return;
    setSeleccion(opcion);
    const correcta = opcion === pregunta.respuesta_correcta;
    if (correcta) setAciertosNivel((c) => c + 1);
    registrarRespuesta(correcta);
    if (correcta) playAcierto();
    else playError();
  };

  const siguiente = async () => {
    if (indice + 1 < preguntas.length) {
      setIndice((i) => i + 1);
      setSeleccion(null);
      return;
    }
    await marcarCompletada(leccionId);
    await registrarRacha();
    // Barra por nivel: aciertos / 5 → %  (1/5=20%, 4/5=80%)
    const pct = Math.round((aciertosNivel / preguntas.length) * 100);
    setProgresoPct(pct);
    setMostrarInforme(true);
  };

  const cerrarInforme = () => {
    setMostrarInforme(false);
    router.back();
  };

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <AppHeader />

        <ScrollView contentContainerStyle={[styles.contenido, { paddingTop: insets.top + Spacing.two }]} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.back()} style={styles.atras}>
            <MaterialCommunityIcons name="chevron-left" size={22} color="#FFFFFF" />
            <Text style={styles.atrasTexto}>{t('header.atras')}</Text>
          </Pressable>
          <View style={styles.bannerFila}>
            <View style={styles.banner}>
              <Text style={styles.bannerTexto}>
                Nivel {numeroLeccion(leccionId)}: {titulo}
              </Text>
            </View>
          </View>
          <SelectorIdioma compact />

          {/* Burbuja de pregunta con la mascota */}
          <View style={styles.preguntaZona}>
            <RobotSaludo
              imagen={require('@/assets/mascotas/gato-calculadora.png')}
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
            {opcionesMezcladas.map((opcion, i) => {
              const esLaCorrecta = respondio && opcion === pregunta.respuesta_correcta;
              const esLaElegida = seleccion === opcion;
              return (
                <Pressable
                  key={`${pregunta.id}-${opcion}`}
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
                {esCorrecta ? t('leccion.correcto') : t('leccion.error')}
              </Text>
              <TextoFormateado texto={pregunta.explicacion_jopara} color={UI.textoSuave} />
              <Button3D
                titulo={indice + 1 < preguntas.length ? t('leccion.siguiente') : t('leccion.finalizar')}
                color={esCorrecta ? UI.verde : UI.rojo}
                colorBorde={esCorrecta ? UI.verdeOscuro : UI.rojoOscuro}
                onPress={siguiente}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {mostrarInforme && (
        <View style={styles.overlay}>
          <View style={styles.informeCard}>
            <Text style={styles.informeTitulo}>🎉 ¡Lección completada!</Text>
            <Text style={styles.informeSub}>INFORME DE PROGRESO</Text>
            <Text style={styles.informeMsg}>¡Javy'a! Tu racha de estudio creció hoy.</Text>

            <View style={styles.barWrap}>
              {/* Píldora con porcentaje arriba de la barra */}
              <View style={styles.pillRow}>
                <View style={{ width: `${progresoPct}%`, alignItems: 'flex-end' }}>
                  <View
                    style={[
                      styles.barPill,
                      {
                        backgroundColor:
                          progresoPct < 30 ? '#E84B3C' : progresoPct < 75 ? '#E9A825' : '#2EB872',
                      },
                    ]}>
                    <Text style={styles.barPillText}>{progresoPct}%</Text>
                  </View>
                  <View
                    style={[
                      styles.pillTri,
                      {
                        borderTopColor:
                          progresoPct < 30 ? '#E84B3C' : progresoPct < 75 ? '#E9A825' : '#2EB872',
                      },
                    ]}
                  />
                </View>
                <View style={{ flex: 1 }} />
              </View>

              <View style={styles.barFondo}>
                <View
                  style={[
                    styles.barRelleno,
                    {
                      width: `${progresoPct}%`,
                      backgroundColor:
                        progresoPct < 30 ? '#E84B3C' : progresoPct < 75 ? '#E9A825' : '#2EB872',
                    },
                  ]}
                />
              </View>
            </View>

            <Pressable onPress={cerrarInforme} style={styles.okBtn}>
              <Text style={styles.okText}>OK</Text>
            </Pressable>
          </View>
        </View>
      )}
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
  atras: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI.rojo,
    borderWidth: 2,
    borderColor: UI.rojoOscuro,
    borderBottomWidth: 4,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: Spacing.two,
  },
  atrasTexto: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
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
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    zIndex: 50,
  },
  informeCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.four,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  informeTitulo: {
    fontSize: 20,
    fontWeight: '900',
    color: UI.texto,
    textAlign: 'center',
  },
  informeSub: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '900',
    color: UI.texto,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  informeMsg: {
    marginTop: 8,
    fontSize: 13,
    color: UI.textoSuave,
    textAlign: 'center',
  },
  barWrap: {
    width: '100%',
    marginTop: Spacing.three,
  },
  pillRow: {
    flexDirection: 'row',
    height: 28,
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  barPill: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 44,
    alignItems: 'center',
  },
  barPillText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  pillTri: {
    width: 0,
    height: 0,
    alignSelf: 'center',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  barFondo: {
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EAECEF',
    overflow: 'hidden',
  },
  barRelleno: {
    height: '100%',
    borderRadius: 9,
  },
  okBtn: {
    marginTop: Spacing.three,
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EAECEF',
  },
  okText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0E7A6B',
  },
});