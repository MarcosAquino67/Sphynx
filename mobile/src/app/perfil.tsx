import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button3D } from '@/components/Button3D';
import { MascotContainer } from '@/components/MascotContainer';
import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { useUserProgress } from '@/hooks/use-user-progress';
import {
  AVATARES,
  guardarAvatar,
  guardarNombre,
  obtenerAvatar,
  obtenerNombre,
  type AvatarKey,
} from '@/storage/perfil';

/**
 * Pantalla PERFIL: avatar, nombre y estadísticas.
 * Con "Editar perfil" se puede cambiar el nombre (TextInput) y la
 * foto (galería de mascotas, sin permisos). Todo en AsyncStorage.
 */
export default function PerfilScreen() {
  const { streak } = useUserProgress();

  const [nombre, setNombre] = useState('Estudiante');
  const [avatar, setAvatar] = useState<AvatarKey>('gato-saludo');
  const [editando, setEditando] = useState(false);
  const [borradorNombre, setBorradorNombre] = useState('');
  const [borradorAvatar, setBorradorAvatar] = useState<AvatarKey>('gato-saludo');

  const cargar = useCallback(async () => {
    setNombre(await obtenerNombre());
    setAvatar(await obtenerAvatar());
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  const empezarEdicion = () => {
    setBorradorNombre(nombre);
    setBorradorAvatar(avatar);
    setEditando(true);
  };

  const guardar = async () => {
    await guardarNombre(borradorNombre);
    await guardarAvatar(borradorAvatar);
    await cargar();
    setEditando(false);
    Alert.alert('Perfil actualizado', '¡Listo! Tu perfil quedó guardado.');
  };

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          {editando ? (
            <>
              <Text style={styles.tituloEdicion}>Editar perfil</Text>

              <Text style={styles.rotulo}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={borradorNombre}
                onChangeText={setBorradorNombre}
                placeholder="Tu nombre"
                maxLength={24}
              />

              <Text style={styles.rotulo}>Foto de perfil</Text>
              <View style={styles.galeria}>
                {(Object.keys(AVATARES) as AvatarKey[]).map((key) => (
                  <Pressable
                    key={key}
                    onPress={() => setBorradorAvatar(key)}
                    style={[
                      styles.avatarOpcion,
                      borradorAvatar === key && styles.avatarSeleccionado,
                    ]}>
                    <Image source={AVATARES[key]} style={styles.avatarMini} contentFit="contain" />
                  </Pressable>
                ))}
              </View>

              <Button3D
                titulo="Guardar"
                icono="check"
                color={UI.verde}
                colorBorde={UI.verdeOscuro}
                onPress={guardar}
                style={styles.boton}
              />
              <Pressable onPress={() => setEditando(false)} style={styles.cancelar}>
                <Text style={styles.cancelarTexto}>Cancelar</Text>
              </Pressable>
            </>
          ) : (
            <>
              <MascotContainer
                imagen={AVATARES[avatar]}
                ancho={150}
                alto={150}
                style={styles.avatar}
              />
              <Text style={styles.nombre}>{nombre}</Text>
              <Text style={styles.sub}>Cada día, peteĩ logro pyahu</Text>

              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="fire" size={26} color={UI.naranja} />
                  <Text style={styles.statValor}>{streak}</Text>
                  <Text style={styles.statEtiqueta}>Racha</Text>
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
                onPress={empezarEdicion}
                style={styles.boton}
              />
            </>
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
  // --- Modo edición ---
  tituloEdicion: {
    fontSize: 22,
    fontWeight: '900',
    color: UI.texto,
  },
  rotulo: {
    alignSelf: 'flex-start',
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
    fontSize: 14,
    fontWeight: '800',
    color: UI.texto,
  },
  input: {
    width: '100%',
    backgroundColor: UI.tarjeta,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    fontWeight: '600',
    color: UI.texto,
  },
  galeria: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  avatarOpcion: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  avatarSeleccionado: {
    borderColor: UI.azul,
    borderWidth: 3,
    backgroundColor: '#DDF1FD',
  },
  avatarMini: {
    width: '100%',
    height: '100%',
  },
  cancelar: {
    marginTop: Spacing.two,
    padding: Spacing.two,
  },
  cancelarTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: UI.textoSuave,
  },
});