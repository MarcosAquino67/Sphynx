import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button3D } from '@/components/Button3D';
import { MascotContainer } from '@/components/MascotContainer';
import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { useUserProgress } from '@/hooks/use-user-progress';

/**
 * Pantalla PERFIL: avatar del gato científico, nombre y estadísticas
 * (racha, XP y gemas). Botón 3D para editar (próximamente).
 */
export default function PerfilScreen() {
  const { hearts, streak } = useUserProgress();

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <MascotContainer
            imagen={require('@/assets/mascotas/gato-saludo.png')}
            ancho={150}
            alto={150}
            style={styles.avatar}
          />
          <Text style={styles.nombre}>Estudiante</Text>
          <Text style={styles.sub}>Oñeha'ã ha oikuaave cada día</Text>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="fire" size={26} color={UI.naranja} />
              <Text style={styles.statValor}>{streak}</Text>
              <Text style={styles.statEtiqueta}>Racha</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="heart" size={26} color={UI.rojo} />
              <Text style={styles.statValor}>{hearts}</Text>
              <Text style={styles.statEtiqueta}>Vidas</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="star" size={26} color={UI.estrella} />
              <Text style={styles.statValor}>380</Text>
              <Text style={styles.statEtiqueta}>XP Total</Text>
            </View>
          </View>

          <Button3D
            titulo="Editar perfil"
            icono="pencil"
            color={UI.azul}
            colorBorde={UI.azulOscuro}
            onPress={() => Alert.alert('Perfil', 'La edición del perfil llegará pronto.')}
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
    backgroundColor: UI.fondoCeleste,
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
  avatar: {
    borderRadius: 75,
  },
  nombre: {
    marginTop: Spacing.two,
    fontSize: 26,
    fontWeight: '900',
    color: UI.texto,
  },
  sub: {
    marginTop: 4,
    fontSize: 13,
    fontStyle: 'italic',
    color: UI.textoSuave,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.four,
    width: '100%',
  },
  statItem: {
    flex: 1,
    backgroundColor: UI.tarjeta,
    borderRadius: RADIO_TARJETA,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statValor: {
    fontSize: 20,
    fontWeight: '900',
    color: UI.texto,
  },
  statEtiqueta: {
    fontSize: 12,
    fontWeight: '700',
    color: UI.textoSuave,
  },
  boton: {
    width: '100%',
    marginTop: Spacing.four,
  },
});