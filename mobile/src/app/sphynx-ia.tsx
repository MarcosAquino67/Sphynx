import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
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
import { TextoFormateado } from '@/components/TextoFormateado';
import { Spacing, UI } from '@/constants/theme';
import { useIdioma } from '@/context/IdiomaContext';
import { preguntarSphynxIA, type MensajeIA } from '@/services/ia';

type Item = MensajeIA & { id: string; imagen?: string | null };

let seq = 0;
const nid = () => `m${Date.now()}-${seq++}`;

const GATO_FELIZ = require('@/assets/chatbotia/gato-ia-feliz.png');
const GATO_PENSANDO = require('@/assets/chatbotia/gato-ia-pensando.png');
const GATO_CARA = require('@/assets/chatbotia/gato-cara.jpg');

/**
 * SPHYNX IA — chat con Muse Spark 1.3 (vía backend /api/ia).
 * Solo responde Física, en ES o Jopara según el selector.
 * Gato científico arrastrable a cualquier parte de la pantalla
 * (feliz normal, pensando mientras la IA responde).
 * Botón + estilo ChatGPT: subir foto de galería o sacar foto con cámara.
 * Necesita internet + backend con OPENCODE_API_KEY (ver backend/ia.py).
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
  const [menuAbierto, setMenuAbierto] = useState(false);
  const lista = useRef<FlatList<Item>>(null);

  const tomarDeGaleria = async () => {
    setMenuAbierto(false);
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

  const sacarFoto = async () => {
    setMenuAbierto(false);
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchCameraAsync({
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
    setMenuAbierto(false);
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
          behavior="padding"
          keyboardVerticalOffset={0}>
          {/* Cabecera */}
          <View style={styles.cabecera}>
            <Image source={GATO_CARA} style={styles.avatar} />
            <View style={styles.cabTextos}>
              <Text style={styles.titulo}>SPHYNX IA</Text>
              <Text style={styles.sub}>
                {jopara ? 'Solo Física rehegua' : 'Solo Física'}
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
                {item.rol === 'ia' ? (
                  <TextoFormateado texto={item.texto} />
                ) : (
                  <Text style={[styles.msgTexto, styles.msgYo]}>{item.texto}</Text>
                )}
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

          {/* Menú desplegable estilo ChatGPT */}
          {menuAbierto && (
            <View style={styles.menu}>
              <Pressable onPress={tomarDeGaleria} style={styles.menuItem}>
                <View style={[styles.menuIcono, { backgroundColor: '#E3F2FD' }]}>
                  <MaterialCommunityIcons name="image" size={24} color={UI.azul} />
                </View>
                <Text style={styles.menuTexto}>{jopara ? 'Ehupi ta\'anga' : 'Subir foto'}</Text>
              </Pressable>
              <View style={styles.menuDivisor} />
              <Pressable onPress={sacarFoto} style={styles.menuItem}>
                <View style={[styles.menuIcono, { backgroundColor: '#E8F5E9' }]}>
                  <MaterialCommunityIcons name="camera" size={24} color={UI.verde} />
                </View>
                <Text style={styles.menuTexto}>{jopara ? 'Esaca foto' : 'Sacar foto'}</Text>
              </Pressable>
            </View>
          )}

          {/* Entrada: + | caja texto | enviar */}
          <View style={styles.entrada}>
            <Pressable
              onPress={() => setMenuAbierto((v) => !v)}
              style={styles.btnMas}
              accessibilityLabel="Más opciones">
              <MaterialCommunityIcons
                name={menuAbierto ? 'close' : 'plus'}
                size={26}
                color={UI.texto}
              />
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

        {/* Gato científico quieto al costado (sin fondo) */}
        <View style={styles.gatoFijo} pointerEvents="none">
          <Image
            source={cargando ? GATO_PENSANDO : GATO_FELIZ}
            style={styles.gatoImg}
            resizeMode="contain"
          />
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
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    backgroundColor: '#FFFFFF',
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
    paddingLeft: 116,
    paddingRight: Spacing.four,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
    paddingBottom: 110,
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
  menu: {
    marginHorizontal: Spacing.four,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
  },
  menuIcono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: UI.texto,
  },
  menuDivisor: {
    height: 1,
    backgroundColor: UI.bordeTarjeta,
    marginHorizontal: Spacing.three,
  },
  entrada: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    paddingTop: 4,
  },
  btnMas: {
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
  gatoFijo: {
    position: 'absolute',
    left: 8,
    top: '38%',
    width: 100,
    height: 56,
    zIndex: 1,
  },
  gatoImg: {
    width: '100%',
    height: '100%',
  },
});
