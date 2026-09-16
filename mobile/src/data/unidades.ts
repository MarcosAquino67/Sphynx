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
  /** Título completo para la tarjeta, ej. "UNIDAD 1: MOVIMIENTO Y FUERZAS". */
  titulo: string;
  /** Nombre corto del tema, ej. "Movimiento y Fuerzas". */
  nombre: string;
  descripcion: string;
  /** Color pastel de la tarjeta + su tono oscuro para bordes. */
  color: string;
  colorOscuro: string;
  icono: IconoMCI;
  /** Mascota que acompaña la pantalla de la unidad. */
  mascota: ImageSourcePropType;
  /** Contenido de la pantalla de teoría. */
  teoriaTitulo: string;
  teoriaTexto: string;
  niveles: Nivel[];
  /** Si es false, la unidad muestra "Próximamente" y no se puede abrir. */
  disponible: boolean;
};

export const UNIDADES: Unidad[] = [
  {
    id: 1,
    titulo: 'UNIDAD 1: MOVIMIENTO Y FUERZAS',
    nombre: 'Movimiento y Fuerzas',
    descripcion: 'Cinemática y leyes de Newton paso a paso',
    color: UI.azul,
    colorOscuro: UI.azulOscuro,
    icono: 'school',
    mascota: require('@/assets/mascotas/gato-regla.jpeg'),
    teoriaTitulo: 'Movimiento y Fuerzas',
    teoriaTexto:
      'La cinemática estudia el movimiento: velocidad, aceleración y caída libre. ' +
      'Las leyes de Newton explican las fuerzas: inercia, F = m · a, y acción-reacción.',
    niveles: [
      { n: 1, nombre: 'Velocidad', leccionId: 1 },
      { n: 2, nombre: 'Aceleración', leccionId: 2 },
      { n: 3, nombre: 'Caída libre', leccionId: 3 },
      { n: 4, nombre: 'Movimiento circular', leccionId: 4 },
      { n: 5, nombre: 'Primera ley', leccionId: 5 },
      { n: 6, nombre: 'Segunda ley', leccionId: 6 },
      { n: 7, nombre: 'Tercera ley', leccionId: 7 },
    ],
    disponible: true,
  },
  {
    id: 2,
    titulo: 'UNIDAD 2: ENERGÍA Y TRABAJO',
    nombre: 'Energía y Trabajo',
    descripcion: 'Energía cinética, potencial y potencia',
    color: UI.verde,
    colorOscuro: UI.verdeOscuro,
    icono: 'lightbulb',
    mascota: require('@/assets/mascotas/gato-lapiz.jpeg'),
    teoriaTitulo: 'Energía y Trabajo',
    teoriaTexto:
      'La energía cinética depende del movimiento (Ec = ½·m·v²) y la potencial de la altura ' +
      '(Ep = m·g·h). El trabajo es fuerza por distancia (W = F·d).',
    niveles: [
      { n: 1, nombre: 'Energía cinética', leccionId: 8 },
      { n: 2, nombre: 'Energía potencial', leccionId: 9 },
      { n: 3, nombre: 'Trabajo y potencia', leccionId: 10 },
    ],
    disponible: true,
  },
  {
    id: 3,
    titulo: 'UNIDAD 3: ELECTRICIDAD Y MAGNETISMO',
    nombre: 'Electricidad y Magnetismo',
    descripcion: 'Cargas, ley de Coulomb y campo eléctrico',
    color: UI.morado,
    colorOscuro: UI.moradoOscuro,
    icono: 'atom',
    mascota: require('@/assets/mascotas/gato-calculadora.jpeg'),
    teoriaTitulo: 'Electricidad y Magnetismo',
    teoriaTexto:
      'Las cargas opuestas se atraen y las iguales se repelen. La ley de Coulomb calcula ' +
      'la fuerza eléctrica (F = k·q1·q2/r²) y el campo indica su dirección en el espacio.',
    niveles: [
      { n: 1, nombre: 'Carga eléctrica', leccionId: 11 },
      { n: 2, nombre: 'Ley de Coulomb', leccionId: 12 },
      { n: 3, nombre: 'Campo eléctrico', leccionId: 13 },
    ],
    disponible: true,
  },
  {
    id: 4,
    titulo: 'UNIDAD 4: ÓPTICA',
    nombre: 'Óptica',
    descripcion: 'Luz, reflexión y refracción',
    color: UI.naranja,
    colorOscuro: UI.naranjaOscuro,
    icono: 'triangle',
    mascota: require('@/assets/mascotas/robot.jpeg'),
    teoriaTitulo: 'Óptica',
    teoriaTexto: 'Contenido en preparación.',
    niveles: [],
    disponible: false,
  },
];

export function obtenerUnidad(id: number): Unidad | undefined {
  return UNIDADES.find((u) => u.id === id);
}