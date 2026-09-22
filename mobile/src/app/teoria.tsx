import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccordionItem } from '@/components/AccordionItem';
import { Button3D } from '@/components/Button3D';
import { RobotSaludo } from '@/components/RobotSaludo';
import { Spacing, UI } from '@/constants/theme';
import { obtenerSubtema, obtenerUnidad } from '@/data/unidades';

/**
 * Pantalla APRENDER / TEORÍA con secciones desplegables (acordeón).
 * Cada subtema muestra su teoría en tarjetas que se abren/cierran
 * a ritmo del estudiante, en español o jopara.
 */
export default function TeoriaScreen() {
  const params = useLocalSearchParams<{ unidad?: string; subtema?: string }>();
  const unidad = obtenerUnidad(Number(params.unidad ?? 1));
  const sub = unidad && obtenerSubtema(unidad.id, Number(params.subtema ?? unidad.subtemas[0]?.id ?? 1));
  const [idioma, setIdioma] = useState<'es' | 'jopara'>('es');
  const insets = useSafeAreaInsets();

  if (!unidad || !sub) {
    router.back();
    return null;
  }

  return (
    <View style={styles.fondo}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={[styles.contenido, { paddingTop: insets.top + Spacing.four }]} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.back()} style={styles.atras}>
            <MaterialCommunityIcons name="chevron-left" size={22} color="#FFFFFF" />
            <Text style={styles.atrasTexto}>Atrás</Text>
          </Pressable>
          <Text style={styles.titulo}>{sub.teoriaTitulo.toUpperCase()}</Text>
          <Pressable
            style={styles.idiomaPill}
            onPress={() => setIdioma(idioma === 'es' ? 'jopara' : 'es')}>
            <Text style={styles.idiomaTexto}>
              {idioma === 'es' ? '🇵🇾 Jopara' : '🇪🇸 Español'}
            </Text>
          </Pressable>

          <RobotSaludo
            imagen={sub.mascota}
            ancho={130}
            alto={130}
            conMarco={false}
          />

          {/* Secciones desplegables (la primera empieza abierta) */}
          <View style={styles.acordeon}>
            {sub.secciones.map((sec, i) => (
              <AccordionItem
                key={sec.titulo}
                titulo={sec.titulo}
                contenido={idioma === 'es' ? sec.texto_es : sec.texto_jopara}
                imagen={sec.imagen}
                referencia={sec.referencia}
                referenciaUrl={sec.referenciaUrl}
                abiertoInicial={i === 0}
              />
            ))}
          </View>

          <Text style={styles.fuente}>Fuente: Cuadernillo MEC · Física 3er curso</Text>

          <Button3D
            titulo="EJERCICIOS"
            icono="pencil"
            color={unidad.color}
            colorBorde={unidad.colorOscuro}
            onPress={() =>
              router.push(
                { pathname: '/niveles', params: { unidad: String(unidad.id), subtema: String(sub.id) } } as any,
              )
            }
            style={styles.boton}
          />

          <Pressable onPress={() => router.back()} style={styles.backPage}>
            <Text style={styles.backPageTexto}>Back page</Text>
          </Pressable>
        </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
  },
  atras: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI.rojo,
    borderWidth: 2,
    borderColor: UI.rojoOscuro,
    borderBottomWidth: 4,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: Spacing.two,
  },
  atrasTexto: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    color: UI.texto,
    textAlign: 'center',
  },
  idiomaPill: {
    marginTop: Spacing.two,
    backgroundColor: UI.tarjeta,
    borderWidth: 2,
    borderColor: UI.bordeTarjeta,
    borderRadius: 16,
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
  },
  idiomaTexto: {
    fontSize: 12,
    fontWeight: '800',
    color: UI.texto,
  },
  acordeon: {
    width: '100%',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  fuente: {
    marginTop: Spacing.three,
    fontSize: 11,
    fontStyle: 'italic',
    color: UI.textoSuave,
    textAlign: 'center',
  },
  boton: {
    width: '100%',
    marginTop: Spacing.three,
  },
  backPage: {
    marginTop: Spacing.three,
    backgroundColor: UI.tarjeta,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: UI.bordeTarjeta,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  backPageTexto: {
    fontSize: 13,
    color: UI.textoSuave,
  },
});