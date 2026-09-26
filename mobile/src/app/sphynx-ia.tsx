import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SelectorIdioma } from '@/components/SelectorIdioma';
import { Spacing, UI } from '@/constants/theme';
import { useIdioma } from '@/context/IdiomaContext';
import { preguntarSphynxIA, type MensajeIA } from '@/services/ia';

type Item = MensajeIA & { id: string; imagen?: string | null };

let seq = 0;
const nid = () => `m${Date.now()}-${seq++}`;

/**
 * SPHYNX IA — chat con Muse Spark 1.3 (vía backend /api/ia).
 * Solo responde Física, en ES o Jopara según el selector.
 * Acepta foto (ejercicio/diagrama): la IA la analiza solo si es física.
 * Necesita internet + backend con OPENROUTER_API_KEY (ver backend/ia.py).
 */
export default function SphynxIAScreen() {
  const { idioma } = useIdioma();
  const jopara = idioma === 'jopara';
  const [mensajes, setMensajes] = useState<Item[]>([
    {
      id: nid(),
      rol: 'ia',
      texto: jopara
        ? '¡Mba\'éichapa! Che ha\'e SPHYNX IA 🤖 Eporandu Física rehegua (movimiento circular, lentes, fuerza, energía...) térã ehupi peteĩ ta\'anga.'
        : '¡Hola! Soy SPHYNX IA 🤖 Preguntame de Física (movimiento circular, lentes, fuerzas, energía...) o subí una foto del ejercicio.',
    },
  ]);
  const [texto, setTexto] = useState('');
  const [imagen, setImagen] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const lista = useRef<FlatList<Item>>(null);

  const elegirImagen = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.6,
      base64: true,
    });
    if (!res.canceled && res.assets[0]?.base64) {
      setImagen(`data:image/jpeg;base64,${res.assets[0].base64}`);
    }
  };

  const enviar = async () => {
    const limpio = texto.trim();
    if ((!limpio && !imagen) || cargando) return;
    const historial: MensajeIA[] = mensajes.map((m) => ({ rol: m.rol, texto: m.texto }));
    const nuevo: Item = { id: nid(), rol: 'usuario', texto: limpio || (jopara ? '¿Mba\'e ojehecha ko ta\'angápe?' : '¿Qué se ve en esta imagen?'), imagen };
    setMensajes((prev) => [...prev, nuevo]);
    setTexto('');
    setImagen(null);
    setCargando(true);
    try {
      const respuesta = await preguntarSphynxIA({
        texto: nuevo.texto,
        idioma,
        imagenBase64: nuevo.imagen,
        historial,
      });
      setMensajes((prev) => [...prev, { id: nid(), rol: 'ia', texto: respuesta }]);
    } catch (e) {
      setMensajes((prev) => [
        ...prev,
        {
          id: nid(),
          rol: 'ia',
          texto:
            e instanceof Error
              ? `⚠️ ${e.message}`
              : jopara
                ? '⚠️ Ndajuhúi conexión. Eikotevẽ internet ha backend oñemopu\'ãva.'
                : '⚠️ Sin conexión. Necesitás internet y el backend levantado.',
        },
      ]);
    } finally {
      setCargando(false);
      setTimeout(() => lista.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Cabecera */}
          <View style={styles.cabecera}>
            <View style={styles.avatarFondo}>
              <MaterialCommunityIcons name="cat" size={28} color={UI.azul} />
            </View>
            <View style={styles.cabTextos}>
              <Text style={styles.titulo}>SPHYNX IA</Text>
              <Text style={styles.sub}>
                {jopara ? 'Solo Física rehegua • Muse Spark' : 'Solo Física • Muse Spark'}
              </Text>
            </View>
          </View>
          <SelectorIdioma compact />

          {/* Chat */}
          <FlatList
            ref={lista}
            data={mensajes}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.chat}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => lista.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View style={[styles.burbuja, item.rol === 'usuario' ? styles.yo : styles.ella]}>
                {item.imagen ? (
                  <Image source={{ uri: item.imagen }} style={styles.miniFoto} />
                ) : null}
                <Text style={[styles.msgTexto, item.rol === 'usuario' && styles.msgYo]}>
                  {item.texto}
                </Text>
              </View>
            )}
          />
          {cargando && (
            <View style={styles.escribiendo}>
              <ActivityIndicator size="small" color={UI.azul} />
              <Text style={styles.escribiendoTexto}>
                {jopara ? 'Sphynx ojepy\'amongeta...' : 'Sphynx está pensando...'}
              </Text>
            </View>
          )}

          {/* Preview imagen elegida */}
          {imagen && (
            <View style={styles.previewRow}>
              <Image source={{ uri: imagen }} style={styles.preview} />
              <Pressable onPress={() => setImagen(null)} style={styles.quitar}>
                <MaterialCommunityIcons name="close" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          )}

          {/* Entrada */}
          <View style={styles.entrada}>
            <Pressable onPress={elegirImagen} style={styles.btnFoto} accessibilityLabel="Subir imagen">
              <MaterialCommunityIcons name="image-plus" size={24} color={UI.azul} />
            </Pressable>
            <TextInput
              style={styles.input}
              value={texto}
              onChangeText={setTexto}
              placeholder={jopara ? 'Eporandu Física rehegua...' : 'Preguntá de Física...'}
              placeholderTextColor={UI.textoSuave}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={enviar}
            />
            <Pressable
              onPress={enviar}
              style={[styles.btnEnviar, ((!texto.trim() && !imagen) || cargando) && styles.btnOff]}
              accessibilityLabel="Enviar">
              <MaterialCommunityIcons name="send" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  avatarFondo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cabTextos: {
    flex: 1,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '900',
    color: UI.texto,
    letterSpacing: 1,
  },
  sub: {
    fontSize: 12,
    fontWeight: '700',
    color: UI.textoSuave,
  },
  chat: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  burbuja: {
    maxWidth: '85%',
    borderRadius: 16,
    padding: Spacing.two,
    borderWidth: 2,
  },
  yo: {
    alignSelf: 'flex-end',
    backgroundColor: UI.azul,
    borderColor: UI.azulOscuro,
  },
  ella: {
    alignSelf: 'flex-start',
    backgroundColor: UI.tarjeta,
    borderColor: UI.bordeTarjeta,
  },
  msgTexto: {
    fontSize: 14,
    lineHeight: 20,
    color: UI.texto,
  },
  msgYo: {
    color: '#FFFFFF',
  },
  miniFoto: {
    width: 180,
    height: 120,
    borderRadius: 10,
    marginBottom: 6,
  },
  escribiendo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.four,
    paddingBottom: 4,
  },
  escribiendoTexto: {
    fontSize: 12,
    fontStyle: 'italic',
    color: UI.textoSuave,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: 6,
  },
  preview: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
  },
  quitar: {
    marginLeft: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: UI.rojo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entrada: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    paddingTop: 4,
  },
  btnFoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    fontSize: 14,
    color: UI.texto,
  },
  btnEnviar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: UI.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOff: {
    opacity: 0.4,
  },
});
