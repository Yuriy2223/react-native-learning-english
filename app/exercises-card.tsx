import { Spinner } from "@/components/Spinner";
import {
  selectCurrentExerciseIndex,
  selectCurrentExercises,
  selectExerciseLoading,
} from "@/redux/exercises/selectors";
import { selectTotalPoints } from "@/redux/user/selectors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { ExerciseHeader } from "../components/ExerciseHeader";
import { ExerciseOptions } from "../components/ExerciseOptions";
import { ExerciseProgress } from "../components/ExerciseProgress";
import { ExerciseQuestion } from "../components/ExerciseQuestion";
import { ExerciseResult } from "../components/ExerciseResult";
import { SIZES } from "../constants";
import { showToast } from "../hooks/showToast";
import { useTheme } from "../hooks/useTheme";
import {
  fetchTopicExercises,
  submitExerciseAnswer,
} from "../redux/exercises/operations";
import { nextExercise, updateTopicProgress } from "../redux/exercises/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { addPoints } from "../redux/user/slice";
import { audioService } from "../services/audio";
import { Exercise } from "../types/exercises.types";

export default function ExerciseCardScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const topicId = params.topicId as string;
  const currentExercises = useAppSelector(selectCurrentExercises);
  const currentExerciseIndex = useAppSelector(selectCurrentExerciseIndex);
  const isLoading = useAppSelector(selectExerciseLoading);
  const userTotalScore = useAppSelector(selectTotalPoints);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (topicId && currentExercises.length === 0) {
      dispatch(fetchTopicExercises(topicId));
    }
  }, [topicId, currentExercises.length, dispatch]);

  useEffect(() => {
    return () => {
      audioService.stop();
    };
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentExerciseIndex, fadeAnim]);

  const currentExercise: Exercise | undefined =
    currentExercises[currentExerciseIndex];

  const handleAnswerSelect = (answer: string) => {
    if (!showResult) {
      setSelectedAnswer(answer);
      audioService.playText(answer, "en");
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentExercise) return;

    const correct = selectedAnswer === currentExercise.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    const earnedPoints = correct ? currentExercise.points : 0;

    try {
      await dispatch(
        submitExerciseAnswer({
          exerciseId: currentExercise.id,
          answer: selectedAnswer,
          isCorrect: correct,
          earnedPoints,
        })
      ).unwrap();

      if (correct) {
        dispatch(addPoints(earnedPoints));
        dispatch(updateTopicProgress({ topicId, earnedPoints }));
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < currentExercises.length - 1) {
      dispatch(nextExercise());
    } else {
      showToast.success({
        message: "Вітаємо! Ви завершили всі вправи теми!",
        duration: 3000,
      });
      setTimeout(() => router.back(), 1500);
    }
  };

  if (isLoading && currentExercises.length === 0) {
    return <Spinner />;
  }

  if (!currentExercise) {
    return (
      <View
        style={[
          styles.container,
          styles.loading,
          { backgroundColor: colors.background },
        ]}
      >
        <Ionicons
          name="game-controller-outline"
          size={64}
          color={colors.textSecondary}
        />
        <Text
          style={[
            styles.loadingText,
            { color: colors.textPrimary, marginTop: SIZES.spacing.md },
          ]}
        >
          Вправи не знайдено
        </Text>
        <Button
          title="Повернутися"
          onPress={() => router.back()}
          variant="outline"
          style={{ marginTop: SIZES.spacing.lg }}
        />
      </View>
    );
  }

  const isLastExercise = currentExerciseIndex === currentExercises.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ExerciseHeader totalScore={userTotalScore} />

      <ExerciseProgress
        currentIndex={currentExerciseIndex}
        totalExercises={currentExercises.length}
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
  loading: {
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.spacing.xl,
  },
  loadingText: {
    fontSize: SIZES.fontSize.lg,
    textAlign: "center",
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
