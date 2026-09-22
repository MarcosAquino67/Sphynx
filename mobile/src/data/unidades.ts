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

export type SeccionTeoria = {
  /** Título de la sección desplegable, ej. "Definición". */
  titulo: string;
  texto_es: string;
  /** Versión en jopara (se alterna con el botón 🇵🇾/🇪🇸). */
  texto_jopara: string;
  /** Imagen opcional de la sección (se muestra al abrir). */
  imagen?: ImageSourcePropType;
  /** Texto de referencia de la imagen (ej. fuente). */
  referencia?: string;
  /** URL de la referencia (si existe). */
  referenciaUrl?: string;
};

export type Subtema = {
  id: number;
  /** Nombre del subtema, ej. "Movimiento Circular". */
  nombre: string;
  descripcion: string;
  /** Descripción en jopara. */
  descripcion_jopara: string;
  icono: IconoMCI;
  /** Mascota que acompaña las pantallas del subtema. */
  mascota: ImageSourcePropType;
  /** Título de la pantalla de teoría. */
  teoriaTitulo: string;
  /** Secciones desplegables (acordeón) de la teoría. */
  secciones: SeccionTeoria[];
  niveles: Nivel[];
};

export type Unidad = {
  id: number;
  /** Título completo para la tarjeta, ej. "UNIDAD 1: MECÁNICA". */
  titulo: string;
  /** Nombre corto del tema, ej. "Mecánica". */
  nombre: string;
  descripcion: string;
  /** Descripción en jopara. */
  descripcion_jopara: string;
  /** Color pastel de la tarjeta + su tono oscuro para bordes. */
  color: string;
  colorOscuro: string;
  icono: IconoMCI;
  /** Mascota del tema (portada). */
  mascota: ImageSourcePropType;
  subtemas: Subtema[];
  /** Si es false, la unidad muestra "Próximamente" y no se puede abrir. */
  disponible: boolean;
};

/**
 * Ramas oficiales del proyecto (cuadernillos MEC 3er curso):
 * - Unidad 1 MECÁNICA → Subtema: Movimiento Circular (MCU)
 * - Unidad 2 ÓPTICA → Subtema: Lentes
 * Son dos ramas distintas de la física. Los demás temas quedan
 * como "Próximamente" (Termodinámica se agregará después).
 */
export const UNIDADES: Unidad[] = [
  {
    id: 1,
    titulo: 'UNIDAD 1: MECÁNICA',
    nombre: 'Mecánica',
    descripcion: 'Cinemática: el movimiento de los cuerpos',
    descripcion_jopara: 'Cinemática ha movimiento',
    color: UI.azul,
    colorOscuro: UI.azulOscuro,
    icono: 'cog',
    mascota: require('@/assets/mascotas/robot.png'),
    subtemas: [
      {
        id: 1,
        nombre: 'Movimiento Circular',
        descripcion: 'Período, frecuencia y velocidades en el MCU',
        descripcion_jopara: 'Período, frecuencia ha velocidad MCU-pe',
        icono: 'reload',
        mascota: require('@/assets/mascotas/gato-regla.png'),
        teoriaTitulo: 'Movimiento Circular Uniforme',
        secciones: [
          {
            titulo: 'Definición',
            texto_es:
              'Un objeto tiene MCU cuando describe circunferencias de radio fijo con rapidez constante: ' +
              'recorre arcos iguales en intervalos de tiempo iguales.',
            texto_jopara: 'MCU ha’e movimiento circular pya’e constante reheve.',
          },
          {
            titulo: 'Magnitudes',
            texto_es:
              'Período (T): tiempo de una vuelta. Frecuencia (f): vueltas por segundo (Hz). ' +
              'Velocidad angular (ω): ángulo/tiempo (rad/s). Velocidad tangencial (v): sobre la ' +
              'trayectoria (m/s). Aceleración centrípeta (ac): radial hacia el centro.',
            texto_jopara:
              'T = tiempo peteĩ vuelta-pe. f = vueltas 1 s-pe. ω = ángulo/tiempo. ' +
              'v = ω·R. ac ohecha centro-pe.',
          },
          {
            titulo: 'Ecuaciones',
            texto_es: 'θ = ω·t · v = ω·R · ac = v²/R = ω²·R · T = 1/f',
            texto_jopara: 'θ = ω·t. v = ω·R. ac = v²/R. T = 1/f.',
          },
          {
            titulo: 'Unidades SI',
            texto_es:
              'T → segundo (s) · f → hertz (Hz = 1/s, 1 Hz = 60 rpm) · ω → radián por segundo (rad/s) · ' +
              'v → metro por segundo (m/s) · ac → metro por segundo al cuadrado (m/s²) · R → metro (m) · θ → radián (rad). ' +
              'Retroalimentación: revisá siempre que el resultado lleve su unidad SI.',
            texto_jopara: 'T (s), f (Hz), ω (rad/s), v (m/s), ac (m/s²), R (m). Ejesareko unidad rehe!',
            imagen: require('@/assets/images/unidades_si_mcu.png'),
            referencia: 'Imagen: elaboración propia — Equipo Sphynx. Unidades según SI Brochure, BIPM 9ª edición.',
            referenciaUrl: 'https://www.bipm.org/en/measurement-units/',
          },
        ],
        niveles: [
          { n: 1, nombre: 'Período y frecuencia', leccionId: 101 },
          { n: 2, nombre: 'Velocidad angular', leccionId: 102 },
          { n: 3, nombre: 'Velocidad tangencial', leccionId: 103 },
          { n: 4, nombre: 'Aceleración centrípeta', leccionId: 104 },
        ],
      },
    ],
    disponible: true,
  },
  {
    id: 2,
    titulo: 'UNIDAD 2: ÓPTICA',
    nombre: 'Óptica',
    descripcion: 'Luz, lentes e imágenes',
    descripcion_jopara: 'Luz, lentes ha imagen',
    color: UI.naranja,
    colorOscuro: UI.naranjaOscuro,
    icono: 'lightbulb',
    mascota: require('@/assets/mascotas/robot.png'),
    subtemas: [
      {
        id: 1,
        nombre: 'Lentes',
        descripcion: 'Convergentes, divergentes e imágenes',
        descripcion_jopara: 'Convergente, divergente ha imagen',
        icono: 'lightbulb',
        mascota: require('@/assets/mascotas/gato-calculadora.png'),
        teoriaTitulo: 'Lentes Convergentes y Divergentes',
        secciones: [
          {
            titulo: 'Definición',
            texto_es:
              'Son medios transparentes limitados por dos superficies, de las cuales al menos una es curva.',
            texto_jopara: 'Lente ha’e mba’e hesakãva, mokõi superficie orekóva.',
          },
          {
            titulo: 'Elementos',
            texto_es:
              '• Centros de curvatura (C, C’): centros geométricos de las superficies curvas.\n' +
              '• Eje principal: línea imaginaria que une los centros de curvatura.\n' +
              '• Centro óptico (O): punto de intersección de la lente con el eje principal.\n' +
              '• Foco (F y F’): punto del eje principal por donde pasan los rayos refractados.\n' +
              '• Distancia focal (f y f’): distancia entre el foco y el centro óptico.',
            texto_jopara:
              'Foco (F): upépe oñembyaty rayos. Centro óptico (O): upépe ohasáva noñemomýi. ' +
              'Distancia focal (f): F ha O mbytépe.',
          },
          {
            titulo: 'Tipos de lentes',
            texto_es:
              'Convergente: mayor grosor en el centro; desvía la luz hacia dentro. ' +
              'Imágenes reales e invertidas (corrige hipermetropía). Variedades: biconvexa, ' +
              'plano-convexa y menisco convergente.\n\n' +
              'Divergente: más delgada en el centro; desvía la luz hacia fuera. ' +
              'Imágenes virtuales, derechas y menores (corrige miopía). Variedades: ' +
              'bicóncava, plano-cóncava y menisco divergente.',
            texto_jopara:
              'Convergente ombyaty luz: imagen real ha invertida (hipermetropía). ' +
              'Divergente omosarambi: imagen virtual, derecha ha michĩ (miopía).',
          },
          {
            titulo: 'Construcción de imágenes',
            texto_es:
              '1. Todo rayo paralelo al eje se refracta pasando por el foco imagen.\n' +
              '2. Todo rayo que pasa por el centro óptico no se desvía.\n' +
              '3. Todo rayo que pasa por el foco objeto se refracta paralelo al eje.',
            texto_jopara:
              'Regla 1: paralelo → foco. Regla 2: centro rupi → noñemomýi. ' +
              'Regla 3: foco rupi → osẽ paralelo.',
          },
          {
            titulo: 'Ecuaciones',
            texto_es:
              '1/f = 1/do + 1/di (do: objeto, di: imagen). Aumento: A = −di/do. ' +
              'Convergente: f’ > 0 (foco real). Divergente: f’ < 0 (foco virtual).',
            texto_jopara: '1/f = 1/do + 1/di. Aumento A = -di/do.',
          },
          {
            titulo: 'Unidades SI',
            texto_es:
              'do, di, f → metro (m) — en los ejercicios se usa centímetro (cm) por comodidad: 1 m = 100 cm. ' +
              'Aumento (A) → sin unidad. Potencia → dioptría (D = 1/m). Signo SI: convergente f > 0, divergente f < 0. ' +
              'Retroalimentación: si ves cm, convertí a m para el SI.',
            texto_jopara: 'do, di, f → metro (m), jaipurúva cm. Aumento ndorekói unidad. Dioptría = 1/m.',
            imagen: require('@/assets/images/unidades_si_lentes.png'),
            referencia: 'Imagen: elaboración propia — Equipo Sphynx. Diagrama basado en cuadernillo MEC Lentes.',
            referenciaUrl: 'https://phet.colorado.edu/en/simulations/geometric-optics',
          },
        ],
        niveles: [
          { n: 1, nombre: 'Lente convergente', leccionId: 201 },
          { n: 2, nombre: 'Lente divergente', leccionId: 202 },
          { n: 3, nombre: 'Elementos de la lente', leccionId: 203 },
          { n: 4, nombre: 'Ecuaciones de lentes', leccionId: 204 },
        ],
      },
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
    mascota: require('@/assets/mascotas/robot.png'),
    subtemas: [],
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
    mascota: require('@/assets/mascotas/robot.png'),
    subtemas: [],
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
    mascota: require('@/assets/mascotas/robot.png'),
    subtemas: [],
    disponible: false,
  },
];

export function obtenerUnidad(id: number): Unidad | undefined {
  return UNIDADES.find((u) => u.id === id);
}

export function obtenerSubtema(unidadId: number, subtemaId: number): Subtema | undefined {
  return obtenerUnidad(unidadId)?.subtemas.find((s) => s.id === subtemaId);
}

/** Busca el nombre de una lección recorriendo temas y subtemas. */
export function nombreLeccion(leccionId: number): string {
  for (const unidad of UNIDADES) {
    for (const sub of unidad.subtemas) {
      const nivel = sub.niveles.find((n) => n.leccionId === leccionId);
      if (nivel) return nivel.nombre;
    }
  }
  return 'Lección';
}

/** Busca el número visible (Niv. N) de una lección para mostrar en pantalla. */
export function numeroLeccion(leccionId: number): number {
  for (const unidad of UNIDADES) {
    for (const sub of unidad.subtemas) {
      const nivel = sub.niveles.find((n) => n.leccionId === leccionId);
      if (nivel) return nivel.n;
    }
  }
  return leccionId;
}