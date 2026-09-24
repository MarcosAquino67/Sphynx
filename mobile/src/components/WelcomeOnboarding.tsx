import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { Button3D } from '@/components/Button3D';
import { Spacing, UI } from '@/constants/theme';

type Props = {
  /** Se llama al terminar el onboarding (botón "¡Empezar ahora!"). */
  onStart: () => void;
};

/**
 * Bienvenida inicial (se muestra solo la primera vez que se abre la app).
 * El robot saludando (GIF convertido de SALUDO.mp4, sin fondo) presenta
 * Sphynx en Jopara dentro de un bocadillo tipo historieta.
 */
export function WelcomeOnboarding({ onStart }: Props) {
  const [step, setStep] = useState(1);
  const ultimo = step === 2;

  return (
    <View style={styles.container}>
      {/* Zona superior: robot + bocadillo de diálogo */}
      <View style={styles.presentationRow}>
        <Image source={require('@/assets/mascotas/robot_saludando.gif')} style={styles.robotImage} contentFit="contain" />

        <View style={styles.speechBubble}>
          <View style={styles.triangleLeft} />
          {step === 1 ? (
            <Text style={styles.bubbleText}>
              ¡Mba&apos;éichapa! 🤖{'\n'}
              Soy el asistente de <Text style={styles.highlight}>Sphynx</Text>.
            </Text>
          ) : (
            <Text style={styles.bubbleText}>
              Acá vas a aprender <Text style={styles.highlight}>física en Jopara</Text> 🚀
            </Text>
          )}
        </View>
      </View>

      {/* Tarjeta informativa central */}
      <View style={styles.infoCard}>
        <Text style={styles.appName}>Sphynx</Text>
        <Text style={styles.appDescription}>
          Tu plataforma gamificada para dominar la física con ejercicios prácticos y lecciones
          en tu idioma.
        </Text>
      </View>

      {/* Botón 3D de interacción */}
      <Button3D
        titulo={step === 1 ? 'Continuar' : '¡Empezar ahora!'}
        icono={step === 1 ? 'play' : 'check'}
        color={UI.verde}
        colorBorde={UI.verdeOscuro}
        onPress={() => (ultimo ? onStart() : setStep(2))}
        style={styles.boton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI.fondoVerde,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  presentationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.five,
    width: '100%',
  },
  robotImage: {
    width: 130,
    height: 170,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: UI.tarjeta,
    borderRadius: 18,
    padding: Spacing.three,
    marginLeft: Spacing.two,
    borderWidth: 2,
    borderColor: UI.azul,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  // Colita del bocadillo apuntando al robot
  triangleLeft: {
    position: 'absolute',
    left: -12,
    top: 30,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderRightWidth: 12,
    borderRightColor: UI.tarjeta,
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
  },
  bubbleText: {
    fontSize: 15,
    color: UI.texto,
    fontWeight: '600',
    lineHeight: 22,
  },
  highlight: {
    color: UI.azulOscuro,
    fontWeight: '800',
  },
  infoCard: {
    backgroundColor: UI.tarjeta,
    width: '100%',
    padding: Spacing.four,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: Spacing.five,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: UI.azulOscuro,
    marginBottom: Spacing.one,
  },
  appDescription: {
    fontSize: 14,
    color: UI.textoSuave,
    textAlign: 'center',
    lineHeight: 20,
  },
  boton: {
    width: '100%',
  },
});