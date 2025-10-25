import { Exercise } from "@/types/exercises.types";
import { router } from "expo-router";
import { useState } from "react";
import { Animated } from "react-native";
import { useAppDispatch } from "../redux/store";
import { addPoints } from "../redux/user/slice";
import { showToast } from "./showToast";

export function useExerciseLogic(exercises: Exercise[]) {
  const dispatch = useAppDispatch();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      showToast.error({
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

      showToast.success({
        message: `Правильно! +${currentExercise.points} балів`,
      });
    } else {
      showToast.error({
        message: `Неправильно. Правильна відповідь: ${currentExercise.correctAnswer}`,
      });
    }
  };

  const handleNextExercise = () => {
    if (isLastExercise) {
      setCompletedExercises(completedExercises + 1);
      showToast.success({
        message: `Вправи завершено! Загальний бал: ${totalScore}`,
        duration: 4000,
      });

      setTimeout(() => {
        router.back();
      }, 2000);
      return;
    }

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

    setCurrentExerciseIndex(currentExerciseIndex + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setCompletedExercises(completedExercises + 1);
  };

  return {
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
  };
}
