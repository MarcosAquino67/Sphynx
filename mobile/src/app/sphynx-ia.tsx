import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing, UI } from '@/constants/theme';

export default function SphynxIAScreen() {
  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <View style={styles.contenido}>
          <View style={styles.iconoFondo}>
            <MaterialCommunityIcons name="cat" size={56} color={UI.azul} />
          </View>
          <Text style={styles.titulo}>SPHYNX IA</Text>
          <Text style={styles.sub}>Próximamente</Text>
          <Text style={styles.desc}>
            Acá va a vivir tu asistente con IA para preguntar física en Jopara. Ahora es un placeholder — después hacemos su interfaz.
          </Text>
        </View>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  iconoFondo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '900',
    color: UI.texto,
    letterSpacing: 1,
  },
  sub: {
    fontSize: 16,
    fontWeight: '800',
    color: UI.azul,
  },
  desc: {
    marginTop: Spacing.two,
    fontSize: 13,
    color: UI.textoSuave,
    textAlign: 'center',
    lineHeight: 18,
  },
});
