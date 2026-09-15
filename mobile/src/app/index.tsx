import { Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { LessonPath, type PhysicsLesson } from '@/components/lesson-path';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

function handleLessonPress(lesson: PhysicsLesson) {
  if (lesson.status === 'bloqueada') {
    Alert.alert('Bloqueada', `Termina la lección anterior para desbloquear "${lesson.titulo}".`);
    return;
  }
  Alert.alert('Ejercicio', `Aquí abrirán las preguntas de "${lesson.titulo}".`);
}

export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
        <AppHeader />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <ThemedText type="title" style={styles.heroTitle}>
            Aprende Física
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.heroSub}>
            Peve kuatia'i ñe'ẽ porã gua'u ha'e aumenta ojeve.
          </ThemedText>
          <LessonPath onPressLesson={handleLessonPress} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.five,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  heroTitle: {
    textAlign: 'center',
    marginTop: Spacing.two,
  },
  heroSub: {
    textAlign: 'center',
    marginTop: Spacing.one,
    marginBottom: Spacing.two,
  },
});