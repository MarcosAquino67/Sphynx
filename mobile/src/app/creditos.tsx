import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { HeaderUnit } from '@/components/HeaderUnit';
import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';

type Fuente = {
  titulo: string;
  lineas: { texto: string; url?: string }[];
};

/**
 * Pantalla CRÉDITOS Y REFERENCIAS (importante para el hackathon).
 * Lista las fuentes de contenidos, inspiración de simuladores e
 * imágenes, con enlaces verificables estilo página de noticias.
 */
const FUENTES: Fuente[] = [
  {
    titulo: '🔬 Simuladores interactivos',
    lineas: [
      {
        texto: 'Inspirados en PhET Interactive Simulations, Universidad de Colorado Boulder (código original de Sphynx, no se redistribuye material PhET)',
      },
      { texto: 'PhET: Geometric Optics (pantalla Lens)', url: 'https://phet.colorado.edu/en/simulations/geometric-optics' },
      {
        texto: 'PhET se publica bajo licencia CC BY-NC 4.0 (atribución requerida)',
        url: 'https://phet.colorado.edu/en/licensing',
      },
    ],
  },
  {
    titulo: '📚 Contenidos de física',
    lineas: [
      {
        texto: 'Cuadernillos MEC «Tu escuela en casa» · Física 3er curso (Plan Común y Plan Específico, Prof. Fredy David Gómez Leguizamón y equipo)',
      },
      { texto: 'Bonjorno, J. Física, Volumen Único. Editorial FTD.' },
      { texto: 'Tippens, P. Física. Conceptos y Aplicaciones. McGraw-Hill.' },
    ],
  },
  {
    titulo: '🎨 Imágenes y mascotas',
    lineas: [
      {
        texto: 'Gato científico y robot: material del equipo Sphynx (ilustraciones generadas por IA para el proyecto, fondos removidos por el equipo)',
      },
      { texto: 'GIF del robot saludando: video del equipo Sphynx convertido a GIF' },
      { texto: 'Iconos de interfaz: MaterialCommunityIcons (@expo/vector-icons)' },
    ],
  },
  {
    titulo: '🎬 Videos',
    lineas: [{ texto: 'SALUDO.mp4 y PRESENTACION.mp4: material audiovisual del equipo Sphynx' }],
  },
];

export default function CreditosScreen() {
  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <HeaderUnit
            titulo="Créditos y referencias"
            subtitulo="Fuentes verificables del proyecto"
            mostrarAtras
            variante="simple"
          />

          {FUENTES.map((fuente) => (
            <View key={fuente.titulo} style={styles.tarjeta}>
              <Text style={styles.tarjetaTitulo}>{fuente.titulo}</Text>
              {fuente.lineas.map((linea, i) =>
                linea.url ? (
                  <ExternalLink key={i} href={linea.url as any}>
                    <Text style={styles.enlace}>🔗 {linea.texto}</Text>
                  </ExternalLink>
                ) : (
                  <Text key={i} style={styles.texto}>
                    • {linea.texto}
                  </Text>
                ),
              )}
            </View>
          ))}

          <Text style={styles.pie}>Sphynx · Física interactiva en Jopara · 2026</Text>
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
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  tarjeta: {
    backgroundColor: UI.tarjeta,
    borderRadius: RADIO_TARJETA,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    padding: Spacing.three,
    gap: Spacing.two,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tarjetaTitulo: {
    fontSize: 16,
    fontWeight: '900',
    color: UI.texto,
  },
  texto: {
    fontSize: 13,
    lineHeight: 19,
    color: UI.texto,
  },
  enlace: {
    fontSize: 13,
    lineHeight: 19,
    color: UI.azulOscuro,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  pie: {
    marginTop: Spacing.two,
    fontSize: 12,
    fontStyle: 'italic',
    color: UI.textoSuave,
    textAlign: 'center',
  },
});