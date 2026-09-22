import { useState } from 'react';
import { LayoutAnimation, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { RADIO_TARJETA, Spacing, UI } from '@/constants/theme';
import { ExternalLink } from '@/components/external-link';
import { playClic } from '@/services/sonidos';

type Props = {
  /** Título de la sección, ej. "Definición". */
  titulo: string;
  /** Contenido que se muestra al desplegar. */
  contenido: string;
  /** Si empieza abierto (por defecto solo la primera sección). */
  abiertoInicial?: boolean;
  /** Imagen opcional de la sección. */
  imagen?: ImageSourcePropType;
  /** Texto de referencia de la imagen. */
  referencia?: string;
  /** URL de la referencia. */
  referenciaUrl?: string;
};

/**
 * Sección desplegable (acordeón) estilo chunky.
 * Toca el encabezado para abrir/cerrar con animación suave.
 * Cada item maneja su propio estado independiente.
 */
export function AccordionItem({ titulo, contenido, abiertoInicial = false, imagen, referencia, referenciaUrl }: Props) {
  const [abierto, setAbierto] = useState(abiertoInicial);

  const alternar = () => {
    playClic();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAbierto((v) => !v);
  };

  return (
    <View style={styles.tarjeta}>
      <Pressable onPress={alternar} style={({ pressed }) => [styles.encabezado, pressed && styles.presionado]}>
        <Text style={styles.titulo}>{titulo}</Text>
        <MaterialCommunityIcons
          name={abierto ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={UI.azulOscuro}
        />
      </Pressable>
      {abierto && (
        <View style={styles.contenido}>
          <Text style={styles.texto}>{contenido}</Text>
          {imagen && <Image source={imagen} style={styles.imagen} contentFit="contain" transition={200} />}
          {referencia && (
            referenciaUrl ? (
              <ExternalLink href={referenciaUrl as any}>
                <Text style={styles.referencia}>🔗 {referencia}</Text>
              </ExternalLink>
            ) : (
              <Text style={styles.referencia}>{referencia}</Text>
            )
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    width: '100%',
    backgroundColor: UI.tarjeta,
    borderRadius: RADIO_TARJETA,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    borderBottomWidth: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    backgroundColor: UI.fondoCeleste,
  },
  presionado: {
    opacity: 0.8,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '800',
    color: UI.texto,
  },
  contenido: {
    padding: Spacing.three,
    backgroundColor: UI.tarjeta,
    gap: Spacing.two,
  },
  texto: {
    fontSize: 14,
    lineHeight: 22,
    color: UI.texto,
  },
  imagen: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    backgroundColor: UI.fondoVerde,
    borderWidth: 1,
    borderColor: UI.bordeTarjeta,
  },
  referencia: {
    fontSize: 11,
    fontStyle: 'italic',
    color: UI.textoSuave,
    textAlign: 'center',
  },
});