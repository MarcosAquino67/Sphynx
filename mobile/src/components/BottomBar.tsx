import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

import { Spacing, UI } from '@/constants/theme';
import { playClic } from '@/services/sonidos';
import type { IconoMCI } from '@/data/unidades';

type Tab = {
  ruta: string;
  etiqueta: string;
  icono: IconoMCI;
};

/** Las 4 pestañas principales (mockups: Inicio, Progreso, Perfil, Ajustes). */
const TABS: Tab[] = [
  { ruta: '/', etiqueta: 'Inicio', icono: 'home' },
  { ruta: '/progreso', etiqueta: 'Progreso', icono: 'chart-bar' },
  { ruta: '/perfil', etiqueta: 'Perfil', icono: 'account' },
  { ruta: '/ajustes', etiqueta: 'Ajustes', icono: 'cog' },
];

/** Rutas de detalle donde la barra se oculta (pantallas con botón Atrás). */
const RUTAS_OCULTAS = ['/unidad', '/subtemas', '/niveles', '/teoria', '/leccion', '/experimento', '/creditos', '/bienvenida'];

/**
 * Barra de navegación inferior fija con iconos vectoriales.
 * Se muestra solo en las 4 pestañas principales; en las pantallas
 * de detalle (unidad, niveles, teoría, lección) se oculta.
 */
export function BottomBar() {
  const pathname = usePathname();

  if (RUTAS_OCULTAS.some((r) => pathname === r || pathname.startsWith(`${r}/`))) {
    return null;
  }

  return (
    <View style={styles.barra}>
      {TABS.map((tab) => {
        const activa = pathname === tab.ruta;
        const color = activa ? UI.azul : UI.iconoInactivo;
        return (
          <Pressable
            key={tab.ruta}
            onPress={() => {
              playClic();
              router.replace(tab.ruta as any);
            }}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityLabel={tab.etiqueta}>
            <View style={[styles.iconoFondo, activa && styles.iconoFondoActivo]}>
              <MaterialCommunityIcons name={tab.icono} size={26} color={color} />
            </View>
            <Text style={[styles.etiqueta, activa && styles.etiquetaActiva]}>{tab.etiqueta}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: UI.barraFondo,
    borderTopWidth: 2,
    borderTopColor: UI.bordeTarjeta,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  iconoFondo: {
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: 16,
  },
  iconoFondoActivo: {
    backgroundColor: '#DDF1FD',
  },
  etiqueta: {
    fontSize: 11,
    fontWeight: '700',
    color: UI.iconoInactivo,
  },
  etiquetaActiva: {
    color: UI.azul,
  },
});