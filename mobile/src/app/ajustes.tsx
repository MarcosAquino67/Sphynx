import { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button3D } from '@/components/Button3D';
import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import type { IconoMCI } from '@/data/unidades';
import { useIdioma, useTraduccion } from '@/context/IdiomaContext';
import { playAmbiente, playClic, stopAmbiente } from '@/services/sonidos';
import { API_URL_KEY, getApiUrl } from '@/services/ia';
import { borrarProgresoLecciones } from '@/storage/progreso';
import { borrarEstadisticas } from '@/storage/estadisticas';

const SONIDO_KEY = '@sphynx/sonido';

/**
 * Pantalla AJUSTES: idioma ES/Jopara, sonido y borrado de progreso.
 * Las preferencias se guardan en AsyncStorage (offline-first).
 */
export default function AjustesScreen() {
  const { idioma, setIdioma } = useIdioma();
  const t = useTraduccion();
  const jopara = idioma === 'jopara';
  const [sonido, setSonido] = useState(true);
  const [servidor, setServidor] = useState('');

  useEffect(() => {
    (async () => {
      const snd = await AsyncStorage.getItem(SONIDO_KEY);
      setSonido(snd !== 'off');
      setServidor(await getApiUrl());
    })();
  }, []);

  const cambiarIdioma = async (valor: boolean) => {
    playClic();
    await setIdioma(valor ? 'jopara' : 'es');
  };

  const cambiarSonido = async (valor: boolean) => {
    playClic();
    setSonido(valor);
    await AsyncStorage.setItem(SONIDO_KEY, valor ? 'on' : 'off');
    if (valor) playAmbiente();
    else stopAmbiente();
  };

  const guardarServidor = async () => {
    playClic();
    const limpio = servidor.trim().replace(/\/+$/, '');
    setServidor(limpio);
    await AsyncStorage.setItem(API_URL_KEY, limpio);
    Alert.alert(t('comunes.listo'), t('ajustes.guardadoDesc'));
  };

  const borrarProgreso = () => {
    Alert.alert(t('ajustes.borrar'), t('ajustes.borrarConfirm'), [
      { text: t('comunes.cancelar'), style: 'cancel' },
      {
        text: t('comunes.borrar'),
        style: 'destructive',
        onPress: async () => {
          await Promise.all([borrarProgresoLecciones(), borrarEstadisticas()]);
          Alert.alert(t('comunes.listo'), t('ajustes.borrarOk'));
        },
      },
    ]);
  };

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <Text style={styles.titulo}>{t('ajustes.titulo')}</Text>

          <View style={styles.tarjeta}>
            <FilaAjuste
              icono="translate"
              titulo={t('ajustes.idioma')}
              descripcion={jopara ? t('ajustes.idiomaDescJopara') : t('ajustes.idiomaDescEs')}
              control={<Switch value={jopara} onValueChange={cambiarIdioma} />}
            />
            <View style={styles.divisor} />
            <FilaAjuste
              icono="volume-high"
              titulo={t('ajustes.sonido')}
              descripcion={sonido ? t('ajustes.sonidoOn') : t('ajustes.sonidoOff')}
              control={<Switch value={sonido} onValueChange={cambiarSonido} />}
            />
          </View>

          <View style={styles.tarjeta}>
            <FilaAjuste
              icono="server-network"
              titulo={t('ajustes.servidor')}
              descripcion={t('ajustes.servidorDesc')}
              control={null}
            />
            <TextInput
              style={styles.input}
              value={servidor}
              onChangeText={setServidor}
              placeholder={t('ajustes.servidorPlaceholder')}
              placeholderTextColor={UI.textoSuave}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            <Button3D
              titulo={t('ajustes.guardar')}
              icono="check"
              color={UI.azul}
              colorBorde={UI.azulOscuro}
              onPress={guardarServidor}
              style={styles.botonGuardar}
            />
          </View>

          <Pressable
            onPress={() => {
              playClic();
              router.push('/bienvenida' as any);
            }}
            style={({ pressed }) => [styles.creditos, pressed && styles.creditosPresionado]}>
            <View style={styles.iconoFondo}>
              <MaterialCommunityIcons name="play" size={24} color={UI.azul} />
            </View>
            <View style={styles.textos}>
              <Text style={styles.filaTitulo}>{t('ajustes.verPresentacion')}</Text>
              <Text style={styles.filaDesc}>{t('ajustes.verPresentacionDesc')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={UI.textoSuave} />
          </Pressable>

          <Pressable
            onPress={() => {
              playClic();
              router.push('/creditos' as any);
            }}
            style={({ pressed }) => [styles.creditos, pressed && styles.creditosPresionado]}>
            <View style={styles.iconoFondo}>
              <MaterialCommunityIcons name="information" size={24} color={UI.azul} />
            </View>
            <View style={styles.textos}>
              <Text style={styles.filaTitulo}>{t('ajustes.creditos')}</Text>
              <Text style={styles.filaDesc}>{t('ajustes.creditosDesc')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={UI.textoSuave} />
          </Pressable>

          <Pressable
            onPress={() => {
              playClic();
              Linking.openURL('https://projectsphynx.brianlucianovargascristaldo.workers.dev/');
            }}
            style={({ pressed }) => [styles.proyectoBtn, pressed && styles.creditosPresionado]}>
            <Image source={require('@/assets/mascotas/gato-saludo.png')} style={styles.proyectoGato} contentFit="contain" />
            <View style={styles.textos}>
              <Text style={styles.filaTitulo}>{t('ajustes.proyecto')}</Text>
              <Text style={styles.filaDesc}>{t('ajustes.proyectoDesc')}</Text>
            </View>
            <MaterialCommunityIcons name="open-in-new" size={22} color={UI.textoSuave} />
          </Pressable>

          <Button3D
            titulo={t('ajustes.borrar')}
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
  input: {
    marginTop: Spacing.two,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
    color: UI.texto,
  },
  botonGuardar: {
    width: '100%',
    marginTop: Spacing.two,
  },
  creditos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
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
  creditosPresionado: {
    opacity: 0.8,
  },
  proyectoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
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
  proyectoGato: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: UI.fondoVerde,
  },
  boton: {
    width: '100%',
  },
});