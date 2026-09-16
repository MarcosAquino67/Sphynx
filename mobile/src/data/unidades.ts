import type { ImageSourcePropType } from 'react-native';
import type { MaterialCommunityIcons } from '@expo/vector-icons';
import { UI } from '@/constants/theme';

/** Nombre de icono válido de MaterialCommunityIcons. */
export type IconoMCI = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export type Nivel = {
  /** Número visible del nivel (Niv. 1, Niv. 2...). */
  n: number;
  /** Nombre corto del nivel (tema). */
  nombre: string;
  /** Id de lección en el banco de preguntas (src/data/preguntas.ts). */
  leccionId: number;
};

export type Unidad = {
  id: number;
  /** Título completo para la tarjeta, ej. "UNIDAD 1: MOVIMIENTO CIRCULAR". */
  titulo: string;
  /** Nombre corto del tema, ej. "Movimiento Circular". */
  nombre: string;
  descripcion: string;
  /** Descripción en jopara para la tarjeta y la cabecera. */
  descripcion_jopara: string;
  /** Color pastel de la tarjeta + su tono oscuro para bordes. */
  color: string;
  colorOscuro: string;
  icono: IconoMCI;
  /** Mascota que acompaña la pantalla de la unidad. */
  mascota: ImageSourcePropType;
  /** Contenido de la pantalla de teoría. */
  teoriaTitulo: string;
  teoriaTexto: string;
  /** Teoría en jopara (se alterna con el botón 🇵🇾/🇪🇸). */
  teoria_jopara: string;
  niveles: Nivel[];
  /** Si es false, la unidad muestra "Próximamente" y no se puede abrir. */
  disponible: boolean;
};

/**
 * Temas oficiales del proyecto (cuadernillos MEC 3er curso):
 * - Movimiento Circular Uniforme (FIS_PE_3_E_03may07)
 * - Lentes / Óptica (FIS_PC_3_E_31may04jun)
 * Los demás temas quedan como "Próximamente".
 */
export const UNIDADES: Unidad[] = [
  {
    id: 1,
    titulo: 'UNIDAD 1: MOVIMIENTO CIRCULAR',
    nombre: 'Movimiento Circular',
    descripcion: 'Período, frecuencia y velocidades en el MCU',
    descripcion_jopara: 'Período, frecuencia ha velocidad MCU-pe',
    color: UI.azul,
    colorOscuro: UI.azulOscuro,
    icono: 'reload',
    mascota: require('@/assets/mascotas/gato-regla.jpeg'),
    teoriaTitulo: 'Movimiento Circular Uniforme',
    teoriaTexto:
      'Un cuerpo tiene MCU cuando describe circunferencias con rapidez constante. ' +
      'Período (T) es el tiempo de una vuelta, frecuencia (f) las vueltas por segundo. ' +
      'Velocidad angular ω = ángulo/tiempo (rad/s), tangencial v = ω·R (m/s) y la ' +
      'aceleración centrípeta apunta siempre al centro (ac = v²/R = ω²·R).',
    teoria_jopara:
      'MCU ha’e movimiento circular pya’e constante-reheve. Período (T) ha’e tiempo ' +
      'peteĩ vuelta-pe, frecuencia (f) vueltas 1 s-pe. Velocidad angular ω = ángulo/tiempo, ' +
      'tangencial v = ω·R, ha aceleración centrípeta ohecha centro-pe (ac = v²/R).',
    niveles: [
      { n: 1, nombre: 'Período y frecuencia', leccionId: 101 },
      { n: 2, nombre: 'Velocidad angular', leccionId: 102 },
      { n: 3, nombre: 'Velocidad tangencial', leccionId: 103 },
      { n: 4, nombre: 'Aceleración centrípeta', leccionId: 104 },
    ],
    disponible: true,
  },
  {
    id: 2,
    titulo: 'UNIDAD 2: LENTES',
    nombre: 'Lentes',
    descripcion: 'Convergentes, divergentes e imágenes',
    descripcion_jopara: 'Convergente, divergente ha imagen',
    color: UI.naranja,
    colorOscuro: UI.naranjaOscuro,
    icono: 'lightbulb',
    mascota: require('@/assets/mascotas/gato-calculadora.jpeg'),
    teoriaTitulo: 'Lentes Convergentes y Divergentes',
    teoriaTexto:
      'La lente convergente es gruesa al centro y junta los rayos: forma imágenes reales ' +
      'e invertidas (corrige la hipermetropía). La divergente es delgada al centro y abre ' +
      'los rayos: forma imágenes virtuales, derechas y menores (corrige la miopía). ' +
      'Elementos: foco (F), centro óptico (O), distancia focal (f) y eje principal.',
    teoria_jopara:
      'Lente convergente ombyaty luz: imagen real ha invertida (hipermetropía). ' +
      'Divergente omosarambi: imagen virtual, derecha ha michĩ (miopía). ' +
      'Elementos: foco (F), centro óptico (O), distancia focal (f) ha eje principal.',
    niveles: [
      { n: 1, nombre: 'Lente convergente', leccionId: 201 },
      { n: 2, nombre: 'Lente divergente', leccionId: 202 },
      { n: 3, nombre: 'Elementos de la lente', leccionId: 203 },
      { n: 4, nombre: 'Ecuaciones de lentes', leccionId: 204 },
    ],
    disponible: true,
  },
  {
    id: 3,
    titulo: 'UNIDAD 3: CINEMÁTICA Y NEWTON',
    nombre: 'Cinemática y Newton',
    descripcion: 'Velocidad, aceleración y leyes de Newton',
    descripcion_jopara: 'Pya’e, aceleración ha leyes de Newton',
    color: UI.morado,
    colorOscuro: UI.moradoOscuro,
    icono: 'school',
    mascota: require('@/assets/mascotas/robot.jpeg'),
    teoriaTitulo: 'Cinemática y Newton',
    teoriaTexto: 'Contenido en preparación.',
    teoria_jopara: 'Oñembosako’i gueteri.',
    niveles: [],
    disponible: false,
  },
  {
    id: 4,
    titulo: 'UNIDAD 4: ENERGÍA Y TRABAJO',
    nombre: 'Energía y Trabajo',
    descripcion: 'Energía cinética, potencial y potencia',
    descripcion_jopara: 'Energía cinética, potencial ha potencia',
    color: UI.verde,
    colorOscuro: UI.verdeOscuro,
    icono: 'flask',
    mascota: require('@/assets/mascotas/robot.jpeg'),
    teoriaTitulo: 'Energía y Trabajo',
    teoriaTexto: 'Contenido en preparación.',
    teoria_jopara: 'Oñembosako’i gueteri.',
    niveles: [],
    disponible: false,
  },
  {
    id: 5,
    titulo: 'UNIDAD 5: ELECTRICIDAD Y MAGNETISMO',
    nombre: 'Electricidad y Magnetismo',
    descripcion: 'Cargas, ley de Coulomb y campo eléctrico',
    descripcion_jopara: 'Carga, ley de Coulomb ha campo eléctrico',
    color: UI.rosa,
    colorOscuro: UI.rosaOscuro,
    icono: 'atom',
    mascota: require('@/assets/mascotas/robot.jpeg'),
    teoriaTitulo: 'Electricidad y Magnetismo',
    teoriaTexto: 'Contenido en preparación.',
    teoria_jopara: 'Oñembosako’i gueteri.',
    niveles: [],
    disponible: false,
  },
];

export function obtenerUnidad(id: number): Unidad | undefined {
  return UNIDADES.find((u) => u.id === id);
}