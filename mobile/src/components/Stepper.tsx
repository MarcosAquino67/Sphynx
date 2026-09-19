import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing, UI } from '@/constants/theme';

type Props = {
  /** Etiqueta encima del control, ej. "Distancia focal". */
  etiqueta: string;
  /** Valor ya formateado, ej. "12 cm". */
  valor: string;
  onMenos: () => void;
  onMas: () => void;
};

/**
 * Control paso a paso estilo chunky (- valor +) para los simuladores.
 */
export function Stepper({ etiqueta, valor, onMenos, onMas }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <View style={styles.fila}>
        <Pressable onPress={onMenos} style={({ pressed }) => [styles.boton, pressed && styles.presionado]}>
          <Text style={styles.signo}>−</Text>
        </Pressable>
        <View style={styles.valorCaja}>
          <Text style={styles.valor}>{valor}</Text>
        </View>
        <Pressable onPress={onMas} style={({ pressed }) => [styles.boton, pressed && styles.presionado]}>
          <Text style={styles.signo}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 4,
  },
  etiqueta: {
    fontSize: 12,
    fontWeight: '800',
    color: UI.texto,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  boton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: UI.azul,
    borderWidth: 2,
    borderColor: UI.azulOscuro,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presionado: {
    opacity: 0.8,
  },
  signo: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  valorCaja: {
    minWidth: 70,
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  valor: {
    fontSize: 15,
    fontWeight: '800',
    color: UI.texto,
  },
});