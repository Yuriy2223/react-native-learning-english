// app/exercises.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "../components/Button";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";

import { useAppDispatch } from "../redux/store";
import { addPoints } from "../redux/user/slice";
import { Exercise } from "../types";

// Mock exercises data
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
  const { showSuccess, showError } = useToast();
  const dispatch = useAppDispatch();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  const currentExercise = mockExercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === mockExercises.length - 1;

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      showError({
        message: "Оберіть відповідь",
      });
      return;
    }

    const correct = selectedAnswer === currentExercise.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const newScore = totalScore + currentExercise.points;
      setTotalScore(newScore);
      dispatch(addPoints(currentExercise.points));

      showSuccess({
        message: `Правильно! +${currentExercise.points} балів`,
      });
    } else {
      showError({
        message: `Неправильно. Правильна відповідь: ${currentExercise.correctAnswer}`,
      });
    }
  };

  const handleNextExercise = () => {
    if (isLastExercise) {
      setCompletedExercises(completedExercises + 1);
      showSuccess({
        message: `Вправи завершено! Загальний бал: ${totalScore}`,
        duration: 4000,
      });

      setTimeout(() => {
        router.back();
      }, 2000);
      return;
    }

    // Анімація переходу
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Перейти до наступної вправи
    setCurrentExerciseIndex(currentExerciseIndex + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setCompletedExercises(completedExercises + 1);
  };

  const getExerciseTypeIcon = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return "radio-button-on";
      case "fill_blank":
        return "create";
      case "drag_drop":
        return "move";
      case "audio":
        return "volume-high";
      default:
        return "help-circle";
    }
  };

  const getExerciseTypeLabel = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return "Множинний вибір";
      case "fill_blank":
        return "Заповнити пропуск";
      case "drag_drop":
        return "Перетягування";
      case "audio":
        return "Аудіо вправа";
      default:
        return "Вправа";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Вправи</Text>

        <View style={styles.scoreContainer}>
          <Ionicons name="trophy" size={20} color={colors.warning} />
          <Text style={[styles.scoreText, { color: colors.text }]}>
            {totalScore}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressText, { color: colors.text }]}>
            Вправа {currentExerciseIndex + 1} з {mockExercises.length}
          </Text>
          <Text style={[styles.progressPercent, { color: colors.primary }]}>
            {Math.round(
              ((currentExerciseIndex + 1) / mockExercises.length) * 100
            )}
            %
          </Text>
        </View>

        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: `${
                  ((currentExerciseIndex + 1) / mockExercises.length) * 100
                }%`,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[styles.exerciseContainer, { opacity: fadeAnim }]}
        >
          {/* Exercise Type */}
          <View
            style={[styles.exerciseType, { backgroundColor: colors.surface }]}
          >
            <Ionicons
              name={getExerciseTypeIcon(currentExercise.type) as any}
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.exerciseTypeText, { color: colors.text }]}>
              {getExerciseTypeLabel(currentExercise.type)}
            </Text>
            <View
              style={[
                styles.pointsBadge,
                { backgroundColor: colors.warning + "20" },
              ]}
            >
              <Text style={[styles.pointsText, { color: colors.warning }]}>
                +{currentExercise.points}
              </Text>
            </View>
          </View>

          {/* Question */}
          <View
            style={[
              styles.questionContainer,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text style={[styles.questionText, { color: colors.text }]}>
              {currentExercise.question}
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentExercise.options?.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === currentExercise.correctAnswer;
              const showCorrectAnswer = showResult && isCorrectOption;
              const showWrongAnswer =
                showResult && isSelected && !isCorrectOption;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                    isSelected &&
                      !showResult && {
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + "10",
                      },
                    showCorrectAnswer && {
                      borderColor: colors.success,
                      backgroundColor: colors.success + "20",
                    },
                    showWrongAnswer && {
                      borderColor: colors.error,
                      backgroundColor: colors.error + "20",
                    },
                  ]}
                  onPress={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <View
                      style={[
                        styles.optionIndicator,
                        { borderColor: colors.border },
                        isSelected &&
                          !showResult && {
                            borderColor: colors.primary,
                            backgroundColor: colors.primary,
                          },
                        showCorrectAnswer && {
                          borderColor: colors.success,
                          backgroundColor: colors.success,
                        },
                        showWrongAnswer && {
                          borderColor: colors.error,
                          backgroundColor: colors.error,
                        },
                      ]}
                    >
                      {(isSelected && !showResult) ||
                      showCorrectAnswer ||
                      showWrongAnswer ? (
                        <Ionicons
                          name={
                            showCorrectAnswer
                              ? "checkmark"
                              : showWrongAnswer
                              ? "close"
                              : "checkmark"
                          }
                          size={16}
                          color="#FFFFFF"
                        />
                      ) : null}
                    </View>

                    <Text
                      style={[
                        styles.optionText,
                        { color: colors.text },
                        isSelected && !showResult && { color: colors.primary },
                        showCorrectAnswer && { color: colors.success },
                        showWrongAnswer && { color: colors.error },
                      ]}
                    >
                      {option}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Result Explanation */}
          {showResult && (
            <View
              style={[
                styles.resultContainer,
                {
                  backgroundColor: isCorrect
                    ? colors.success + "10"
                    : colors.error + "10",
                },
              ]}
            >
              <View style={styles.resultHeader}>
                <Ionicons
                  name={isCorrect ? "checkmark-circle" : "close-circle"}
                  size={24}
                  color={isCorrect ? colors.success : colors.error}
                />
                <Text
                  style={[
                    styles.resultTitle,
                    { color: isCorrect ? colors.success : colors.error },
                  ]}
                >
                  {isCorrect ? "Правильно!" : "Неправильно"}
                </Text>
              </View>

              {!isCorrect && (
                <Text
                  style={[
                    styles.resultExplanation,
                    { color: colors.textSecondary },
                  ]}
                >
                  Правильна відповідь: {currentExercise.correctAnswer}
                </Text>
              )}

              <Text style={[styles.resultScore, { color: colors.text }]}>
                {isCorrect ? `+${currentExercise.points} балів` : "0 балів"}
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.md,
  },
  backButton: {
    padding: SIZES.spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    textAlign: "center",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.spacing.xs,
  },
  scoreText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
  progressSection: {
    paddingHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.spacing.sm,
  },
  progressText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
  },
  progressPercent: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
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
  exerciseType: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.spacing.lg,
  },
  exerciseTypeText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
    marginLeft: SIZES.spacing.sm,
    flex: 1,
  },
  pointsBadge: {
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.sm,
  },
  pointsText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "600",
  },
  questionContainer: {
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
    marginBottom: SIZES.spacing.lg,
    minHeight: 100,
    justifyContent: "center",
  },
  questionText: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    lineHeight: 28,
    textAlign: "center",
  },
  optionsContainer: {
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.lg,
  },
  optionButton: {
    borderWidth: 2,
    borderRadius: SIZES.borderRadius.md,
    padding: SIZES.spacing.md,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.spacing.md,
  },
  optionText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
    flex: 1,
  },
  resultContainer: {
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
    marginBottom: SIZES.spacing.lg,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.spacing.sm,
  },
  resultTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginLeft: SIZES.spacing.sm,
  },
  resultExplanation: {
    fontSize: SIZES.fontSize.md,
    marginBottom: SIZES.spacing.sm,
  },
  resultScore: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
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
