import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
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

const GATO_FELIZ = require('@/assets/chatbotia/gato-ia-feliz.jpg');
const GATO_PENSANDO = require('@/assets/chatbotia/gato-ia-pensando.jpg');

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
  const { width, height } = useWindowDimensions();
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

  // Gato flotante arrastrable (se queda donde lo soltás)
  const pan = useRef(new Animated.ValueXY({ x: 12, y: Math.round(height * 0.45) })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

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
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Cabecera */}
          <View style={styles.cabecera}>
            <Image source={GATO_FELIZ} style={styles.avatar} />
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

        {/* Gato científico flotante: arrastralo a donde quieras */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.gatoFlotante,
            {
              maxWidth: width - 96,
              maxHeight: height - 220,
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            },
          ]}>
          <Image
            source={cargando ? GATO_PENSANDO : GATO_FELIZ}
            style={styles.gatoImg}
            resizeMode="cover"
          />
        </Animated.View>
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
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
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
  gatoFlotante: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 50,
  },
  gatoImg: {
    width: '100%',
    height: '100%',
  },
});
