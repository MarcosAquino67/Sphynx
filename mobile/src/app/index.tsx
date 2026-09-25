import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { UNIDADES, type Unidad } from '@/data/unidades';
import { useIdioma, useTraduccion } from '@/context/IdiomaContext';
import { playClic } from '@/services/sonidos';

/**
 * Pantalla INICIO: lista de unidades temáticas (mockup "UNIDADES TEMÁTICAS
 * DE APRENDIZAJE"). Tarjetas pastel con icono, descripción y píldora
 * Comenzar/Próximamente. Abajo, el robot mascota.
 */
export default function InicioScreen() {
  const { idioma } = useIdioma();
  const t = useTraduccion();

  const abrirUnidad = (unidad: Unidad) => {
    playClic();
    if (!unidad.disponible) {
      Alert.alert(t('inicio.proximamente'), `"${unidad.nombre}" estará disponible muy pronto.`);
      return;
    }
    router.push({ pathname: '/subtemas', params: { unidad: String(unidad.id) } } as any);
  };

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          {/* Icono casita superior (mockup) */}
          <View style={styles.casaFondo}>
            <MaterialCommunityIcons name="home" size={30} color={UI.texto} />
          </View>

          <Text style={styles.titulo}>UNIDADES TEMÁTICAS{'\n'}DE APRENDIZAJE</Text>

          <View style={styles.lista}>
            {UNIDADES.map((unidad) => (
              <Pressable
                key={unidad.id}
                onPress={() => abrirUnidad(unidad)}
                style={[styles.tarjeta, { backgroundColor: unidad.color, borderColor: unidad.colorOscuro }]}>
                <View style={styles.iconoCaja}>
                  <MaterialCommunityIcons name={unidad.icono} size={34} color={UI.texto} />
                </View>
                <View style={styles.textos}>
                  <Text style={styles.tarjetaTitulo}>{unidad.titulo}</Text>
                  <Text style={styles.tarjetaDesc}>
                    {idioma === 'jopara' ? unidad.descripcion_jopara : unidad.descripcion}
                  </Text>
                  <View style={styles.pildora}>
                    <Text style={styles.pildoraTexto}>
                      {unidad.disponible ? t('inicio.comenzar') : t('inicio.proximamente')}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
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
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  casaFondo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    marginTop: Spacing.two,
    fontSize: 20,
    fontWeight: '900',
    color: UI.texto,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  lista: {
    width: '100%',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  tarjeta: {
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
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    gap: 4,
  },
  tarjetaTitulo: {
    fontSize: 14,
    fontWeight: '900',
    color: UI.texto,
  },
  tarjetaDesc: {
    fontSize: 12,
    color: UI.texto,
    opacity: 0.75,
  },
  tarjetaJopara: {
    fontSize: 11,
    fontStyle: 'italic',
    color: UI.texto,
    opacity: 0.65,
  },
  pildora: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: UI.tarjeta,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  pildoraTexto: {
    fontSize: 12,
    fontWeight: '800',
    color: UI.texto,
  },
  robot: {
    marginTop: Spacing.three,
  },
});