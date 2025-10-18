import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { Button } from "../components/Button";
import { ExerciseHeader } from "../components/ExerciseHeader";
import { ExerciseOptions } from "../components/ExerciseOptions";
import { ExerciseProgress } from "../components/ExerciseProgress";
import { ExerciseQuestion } from "../components/ExerciseQuestion";
import { ExerciseResult } from "../components/ExerciseResult";
import { SIZES } from "../constants";
import { useExerciseLogic } from "../hooks/useExerciseLogic.ts";
import { useTheme } from "../hooks/useTheme";
import { Exercise } from "../types";

const mockExercises: Exercise[] = [
  {
    id: "1",
    type: "multiple_choice",
    question: 'Оберіть правильний переклад слова "apple":',
    options: ["яблуко", "апельсин", "банан", "груша"],
    correctAnswer: "яблуко",
    points: 10,
  },
  {
    id: "2",
    type: "multiple_choice",
    question: 'Як сказати "Привіт" англійською?',
    options: ["Goodbye", "Hello", "Thanks", "Sorry"],
    correctAnswer: "Hello",
    points: 10,
  },
  {
    id: "3",
    type: "fill_blank",
    question: 'Заповніть пропуск: "I ___ a student"',
    options: ["am", "is", "are", "be"],
    correctAnswer: "am",
    points: 15,
  },
  {
    id: "4",
    type: "multiple_choice",
    question: 'Що означає "Good morning"?',
    options: ["Доброго дня", "Добрий ранок", "Добрий вечір", "Доброї ночі"],
    correctAnswer: "Добрий ранок",
    points: 10,
  },
  {
    id: "5",
    type: "fill_blank",
    question: 'Заповніть: "She ___ from Ukraine"',
    options: ["am", "is", "are", "be"],
    correctAnswer: "is",
    points: 15,
  },
];

export default function ExercisesScreen() {
  const { colors } = useTheme();
  const {
    currentExercise,
    currentExerciseIndex,
    selectedAnswer,
    showResult,
    isCorrect,
    totalScore,
    isLastExercise,
    fadeAnim,
    handleAnswerSelect,
    handleSubmitAnswer,
    handleNextExercise,
  } = useExerciseLogic(mockExercises);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ExerciseHeader totalScore={totalScore} />

      <ExerciseProgress
        currentIndex={currentExerciseIndex}
        totalExercises={mockExercises.length}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[styles.exerciseContainer, { opacity: fadeAnim }]}
        >
          <ExerciseQuestion exercise={currentExercise} />

          <ExerciseOptions
            options={currentExercise.options || []}
            selectedAnswer={selectedAnswer}
            correctAnswer={currentExercise.correctAnswer}
            showResult={showResult}
            onSelectAnswer={handleAnswerSelect}
          />

          {showResult && (
            <ExerciseResult
              isCorrect={isCorrect}
              correctAnswer={currentExercise.correctAnswer}
              points={currentExercise.points}
            />
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        {!showResult ? (
          <Button
            title="Підтвердити відповідь"
            onPress={handleSubmitAnswer}
            disabled={!selectedAnswer}
            size="large"
            style={styles.submitButton}
          />
        ) : (
          <Button
            title={isLastExercise ? "Завершити вправи" : "Наступна вправа"}
            onPress={handleNextExercise}
            size="large"
            style={[
              styles.nextButton,
              {
                backgroundColor: isLastExercise
                  ? colors.success
                  : colors.primary,
              },
            ]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
  },
  exerciseContainer: {
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.md,
  },
  submitButton: {
    width: "100%",
  },
  nextButton: {
    width: "100%",
  },
});
