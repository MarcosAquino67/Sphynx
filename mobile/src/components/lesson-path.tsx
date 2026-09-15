import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { CatMascot } from '@/components/cat-mascot';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing, Sphynx } from '@/constants/theme';

const NODE = 64;
const START_NODE = 84;
const GAP = 110;
const SIDE_PAD = 24;

const PATH_LOCKED = '#E0E0E0';
const NODE_LOCKED = '#CDCDCD';

export type LessonStatus = 'completada' | 'actual' | 'bloqueada';

export type PhysicsLesson = {
  id: number;
  titulo: string;
  status: LessonStatus;
};

export type PhysicsUnit = {
  id: number;
  titulo: string;
  subtitulo: string;
  lecciones: PhysicsLesson[];
};

export const UNIDADES: PhysicsUnit[] = [
  {
    id: 1,
    titulo: 'Cinemática',
    subtitulo: "Ojehecha mboy pya'e oho pe mba'e",
    lecciones: [
      { id: 1, titulo: 'Velocidad', status: 'completada' },
      { id: 2, titulo: 'Aceleración', status: 'completada' },
      { id: 3, titulo: 'Caída libre', status: 'actual' },
      { id: 4, titulo: 'Movimiento circular', status: 'bloqueada' },
    ],
  },
  {
    id: 2,
    titulo: 'Fuerzas y Leyes de Newton',
    subtitulo: "Fuerza ha'e masa por aceleración",
    lecciones: [
      { id: 5, titulo: 'Primera ley', status: 'bloqueada' },
      { id: 6, titulo: 'Segunda ley', status: 'bloqueada' },
      { id: 7, titulo: 'Tercera ley', status: 'bloqueada' },
    ],
  },
  {
    id: 3,
    titulo: 'Energía',
    subtitulo: 'Hipérbole del movimiento y del calor',
    lecciones: [
      { id: 8, titulo: 'Energía cinética', status: 'bloqueada' },
      { id: 9, titulo: 'Energía potencial', status: 'bloqueada' },
      { id: 10, titulo: 'Trabajo y potencia', status: 'bloqueada' },
    ],
  },
];

type LessonRowProps = {
  lesson: PhysicsLesson;
  index: number;
  rowWidth: number;
  previousStatus?: LessonStatus;
  isFirst: boolean;
  onPressLesson: (lesson: PhysicsLesson) => void;
};

function LessonRow({ lesson, index, rowWidth, previousStatus, isFirst, onPressLesson }: LessonRowProps) {
  const side = index % 2 === 0 ? 'left' : 'right';
  const centerX = rowWidth / 2;
  const nodeDiam = isFirst ? START_NODE : NODE;
  const nodeX = side === 'left' ? SIDE_PAD : rowWidth - SIDE_PAD - nodeDiam;
  const elbowStart = side === 'left' ? nodeX + nodeDiam : centerX;
  const elbowWidth = side === 'left' ? centerX - (nodeX + nodeDiam) : nodeX - centerX;

  const done = lesson.status === 'completada';
  const active = lesson.status === 'actual';
  const locked = lesson.status === 'bloqueada';
  const lineColor = previousStatus === undefined || previousStatus === 'bloqueada' ? PATH_LOCKED : Sphynx.green;
  const nodeBg = locked ? NODE_LOCKED : Sphynx.green;

  return (
    <View style={[styles.row, { height: GAP, width: rowWidth }]}>
      <View
        style={[
          styles.trunk,
          { left: centerX - 2, top: isFirst ? GAP / 2 : 0, bottom: 0, backgroundColor: lineColor },
        ]}
      />
      {!isFirst && (
        <View
          style={[
            styles.elbow,
            { left: elbowStart, top: GAP / 2 - 2, width: elbowWidth, backgroundColor: lineColor },
          ]}
        />
      )}

      <Pressable
        onPress={() => onPressLesson(lesson)}
        style={[
          styles.node,
          {
            width: nodeDiam,
            height: nodeDiam,
            borderRadius: nodeDiam / 2,
            left: nodeX,
            top: GAP / 2 - nodeDiam / 2,
            backgroundColor: nodeBg,
          },
          active && styles.nodeActive,
        ]}>
        {isFirst && (
          <ThemedText type="smallBold" style={styles.nodeStartText}>
            ¡Inicio!
          </ThemedText>
        )}
        {done && <ThemedText style={styles.nodeCheck}>✓</ThemedText>}
        {active && <ThemedText style={styles.nodePlay}>▶</ThemedText>}
        {locked && <ThemedText style={styles.nodeLock}>🔒</ThemedText>}
      </Pressable>

      {active && (
        <View style={[styles.labelPill, side === 'left' ? styles.labelLeft : styles.labelRight, { top: GAP / 2 - NODE / 2 - 8 }]}>
          <ThemedText type="smallBold" style={styles.labelPillText}>
            {lesson.titulo}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

type UnitSectionProps = {
  unit: PhysicsUnit;
  baseIndex: number;
  rowWidth: number;
  onPressLesson: (lesson: PhysicsLesson) => void;
};

function UnitSection({ unit, baseIndex, rowWidth, onPressLesson }: UnitSectionProps) {
  return (
    <View style={styles.unit}>
      <ThemedText type="small" style={styles.unitIndex}>
        UNIDAD {unit.id}
      </ThemedText>
      <ThemedText type="subtitle" style={styles.unitTitle}>
        {unit.titulo}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.unitSubtitle}>
        {unit.subtitulo}
      </ThemedText>

      <View style={styles.path}>
        {unit.lecciones.map((lesson, i) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            index={i}
            rowWidth={rowWidth}
            previousStatus={i === 0 ? undefined : unit.lecciones[i - 1].status}
            isFirst={baseIndex + i === 0}
            onPressLesson={onPressLesson}
          />
        ))}
      </View>
    </View>
  );
}

type LessonPathProps = {
  onPressLesson?: (lesson: PhysicsLesson) => void;
};

export function LessonPath({ onPressLesson = () => {} }: LessonPathProps) {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, MaxContentWidth) - Spacing.four * 2;
  let counter = 0;

  return (
    <View style={styles.container}>
      {UNIDADES.map((unit) => {
        const baseIndex = counter;
        counter += unit.lecciones.length;
        return (
          <UnitSection
            key={unit.id}
            unit={unit}
            baseIndex={baseIndex}
            rowWidth={contentWidth}
            onPressLesson={onPressLesson}
          />
        );
      })}

      <View style={styles.finish}>
        <CatMascot size={92} />
        <ThemedText type="smallBold" style={styles.finishText}>
          ¡Apañá mba'e porã! Estás listo para más retos.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
  },
  unit: {
    paddingTop: Spacing.five,
  },
  unitIndex: {
    color: Sphynx.green,
    fontWeight: '800',
    letterSpacing: 1,
  },
  unitTitle: {
    marginTop: Spacing.one,
  },
  unitSubtitle: {
    marginTop: Spacing.half,
  },
  path: {
    marginTop: Spacing.three,
    alignItems: 'center',
  },
  row: {
    position: 'relative',
  },
  trunk: {
    position: 'absolute',
    width: 4,
  },
  elbow: {
    position: 'absolute',
    height: 4,
  },
  node: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeActive: {
    borderWidth: 4,
    borderColor: '#FFE58F',
  },
  nodeStartText: {
    color: '#FFFFFF',
  },
  nodeCheck: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  nodePlay: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  nodeLock: {
    fontSize: 22,
    opacity: 0.9,
  },
  labelPill: {
    position: 'absolute',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    backgroundColor: Sphynx.blue,
    borderRadius: Spacing.four,
    maxWidth: 150,
  },
  labelLeft: {
    right: SIDE_PAD + NODE + 12,
  },
  labelRight: {
    left: SIDE_PAD + NODE + 12,
  },
  labelPillText: {
    color: '#FFFFFF',
  },
  finish: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  finishText: {
    textAlign: 'center',
    maxWidth: 220,
  },
});