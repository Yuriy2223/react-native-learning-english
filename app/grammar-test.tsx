import {
  selectCurrentQuestions,
  selectTestLoading,
} from "@/redux/grammar/selectors";
import { navigate } from "@/utils";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { GrammarTestQuestion } from "../components/GrammarTestQuestion";
import { Spinner } from "../components/Spinner";
import { SIZES } from "../constants";
import { showToast } from "../hooks/showToast";
import { useTheme } from "../hooks/useTheme";
import {
  fetchGrammarQuestions,
  submitGrammarTest,
} from "../redux/grammar/operations";
import { clearTestResult } from "../redux/grammar/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { addPoints } from "../redux/user/slice";

export default function GrammarTestScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const topicId = params.topicId as string;
  const topicTitle = params.topicTitle as string;
  const questions = useAppSelector(selectCurrentQuestions);
  const isLoading = useAppSelector(selectTestLoading);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (topicId) {
      dispatch(clearTestResult());
      dispatch(fetchGrammarQuestions(topicId));
    }
  }, [topicId, dispatch]);

  useEffect(() => {
    if (questions.length > 0) {
      setSelectedAnswers(new Array(questions.length).fill(-1));
    }
  }, [questions]);

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const unansweredCount = selectedAnswers.filter((a) => a === -1).length;

    if (unansweredCount > 0) {
      showToast.error({
        message: `Залишилось ${unansweredCount} питань без відповіді`,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await dispatch(
        submitGrammarTest({ topicId, answers: selectedAnswers })
      ).unwrap();

      const points = result.passed ? 50 : 20;
      dispatch(addPoints(points));

      navigate("/grammar-test-result", {
        topicId: topicId,
        topicTitle: topicTitle,
      });
    } catch (error) {
      console.error("Error submitting test:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Spinner />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Завантаження тесту...
        </Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          Для цієї теми ще немає тестових питань
        </Text>
        <Button
          title="Повернутися"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = selectedAnswers.filter((a) => a !== -1).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {topicTitle}
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Питання {currentQuestionIndex + 1} з {questions.length}
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.primary, width: `${progress}%` },
            ]}
          />
        </View>
        <Text style={[styles.answeredText, { color: colors.textSecondary }]}>
          Відповіли: {answeredCount}/{questions.length}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <GrammarTestQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          selectedAnswer={selectedAnswers[currentQuestionIndex]}
          onSelectAnswer={handleSelectAnswer}
        />
      </ScrollView>

      <View style={[styles.navigation, { backgroundColor: colors.surface }]}>
        <Button
          title="Назад"
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          style={styles.navButton}
        />

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            title="Завершити тест"
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={[styles.navButton, { backgroundColor: colors.success }]}
          />
        ) : (
          <Button title="Далі" onPress={handleNext} style={styles.navButton} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.spacing.xl,
  },
  header: {
    padding: SIZES.spacing.lg,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    marginBottom: SIZES.spacing.xs,
  },
  headerSubtitle: {
    fontSize: SIZES.fontSize.md,
  },
  progressBarContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.md,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: SIZES.spacing.sm,
  },
  progressFill: {
    height: "100%",
  },
  answeredText: {
    fontSize: SIZES.fontSize.sm,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.spacing.lg,
  },
  navigation: {
    flexDirection: "row",
    padding: SIZES.spacing.lg,
    gap: SIZES.spacing.md,
  },
  navButton: {
    flex: 1,
  },
  loadingText: {
    marginTop: SIZES.spacing.md,
    fontSize: SIZES.fontSize.md,
  },
  errorText: {
    fontSize: SIZES.fontSize.lg,
    textAlign: "center",
    marginBottom: SIZES.spacing.xl,
  },
  backButton: {
    minWidth: 200,
  },
});
