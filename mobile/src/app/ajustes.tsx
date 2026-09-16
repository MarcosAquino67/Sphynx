import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button3D } from '@/components/Button3D';
import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import type { IconoMCI } from '@/data/unidades';
import { borrarProgresoLecciones } from '@/storage/progreso';

const IDIOMA_KEY = '@sphynx/idioma';
const SONIDO_KEY = '@sphynx/sonido';

/**
 * Pantalla AJUSTES: idioma ES/Jopara, sonido y borrado de progreso.
 * Las preferencias se guardan en AsyncStorage (offline-first).
 */
export default function AjustesScreen() {
  const [jopara, setJopara] = useState(false);
  const [sonido, setSonido] = useState(true);

  useEffect(() => {
    (async () => {
      const idioma = await AsyncStorage.getItem(IDIOMA_KEY);
      const snd = await AsyncStorage.getItem(SONIDO_KEY);
      setJopara(idioma === 'jopara');
      setSonido(snd !== 'off');
    })();
  }, []);

  const cambiarIdioma = async (valor: boolean) => {
    setJopara(valor);
    await AsyncStorage.setItem(IDIOMA_KEY, valor ? 'jopara' : 'es');
  };

  const cambiarSonido = async (valor: boolean) => {
    setSonido(valor);
    await AsyncStorage.setItem(SONIDO_KEY, valor ? 'on' : 'off');
  };

  const borrarProgreso = () => {
    Alert.alert(
      'Borrar progreso',
      '¿Seguro? Se eliminarán las lecciones completadas de este dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            await borrarProgresoLecciones();
            Alert.alert('Listo', 'Progreso borrado. ¡A empezar de nuevo!');
          },
        },
      ],
    );
  };

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <Text style={styles.titulo}>Ajustes</Text>

          <View style={styles.tarjeta}>
            <FilaAjuste
              icono="translate"
              titulo="Idioma Jopara"
              descripcion={jopara ? 'Preguntas en guaraní' : 'Preguntas en español'}
              control={<Switch value={jopara} onValueChange={cambiarIdioma} />}
            />
            <View style={styles.divisor} />
            <FilaAjuste
              icono="volume-high"
              titulo="Sonido"
              descripcion={sonido ? 'Activado' : 'Silenciado'}
              control={<Switch value={sonido} onValueChange={cambiarSonido} />}
            />
          </View>

          <Button3D
            titulo="Borrar progreso"
            icono="trash-can"
            color={UI.rojo}
            colorBorde={UI.rojoOscuro}
            onPress={borrarProgreso}
            style={styles.boton}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function FilaAjuste({
  icono,
  titulo,
  descripcion,
  control,
}: {
  icono: IconoMCI;
  titulo: string;
  descripcion: string;
  control: React.ReactNode;
}) {
  return (
    <View style={styles.fila}>
      <View style={styles.iconoFondo}>
        <MaterialCommunityIcons name={icono} size={24} color={UI.azul} />
      </View>
      <View style={styles.textos}>
        <Text style={styles.filaTitulo}>{titulo}</Text>
        <Text style={styles.filaDesc}>{descripcion}</Text>
      </View>
      {control}
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
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '900',
    color: UI.texto,
    textAlign: 'center',
  },
  tarjeta: {
    backgroundColor: UI.tarjeta,
    borderRadius: RADIO_TARJETA,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    padding: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
  iconoFondo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#DDF1FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
  },
  filaTitulo: {
    fontSize: 15,
    fontWeight: '800',
    color: UI.texto,
  },
  filaDesc: {
    fontSize: 12,
    color: UI.textoSuave,
  },
  divisor: {
    height: 1,
    backgroundColor: UI.bordeTarjeta,
    marginVertical: Spacing.two,
  },
  boton: {
    width: '100%',
  },
});