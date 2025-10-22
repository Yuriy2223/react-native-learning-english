import { ExerciseLearningOptions } from "@/components/ExerciseLearningOptions";
import { ExerciseTopicStatistics } from "@/components/ExerciseTopicStatistics";
import { Spinner } from "@/components/Spinner";
import {
  selectCurrentExercises,
  selectExerciseLoading,
  selectExerciseTopics,
} from "@/redux/exercises/selectors";
import { calculateProgress, navigate } from "@/utils";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button } from "../components/Button";
import { TopicInfo } from "../components/TopicInfo";
import { SIZES } from "../constants";
import { showToast } from "../hooks/showToast";
import { useTheme } from "../hooks/useTheme";
import { fetchTopicExercises } from "../redux/exercises/operations";
import { setCurrentTopic } from "../redux/exercises/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export default function ExercisesTopicScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const topicId = params.topicId as string;
  const topicTitle = params.topicTitle as string;
  const topics = useAppSelector(selectExerciseTopics);
  const currentExercises = useAppSelector(selectCurrentExercises);
  const isLoading = useAppSelector(selectExerciseLoading);
  const currentTopic = topics.find((topic) => topic.id === topicId);

  useEffect(() => {
    if (topicId) {
      dispatch(fetchTopicExercises(topicId));
    }
  }, [topicId, dispatch]);

  const handleStartLearning = () => {
    if (!currentTopic) {
      showToast.error({ message: "Тема не знайдена" });
      return;
    }

    if (isLoading) return;

    dispatch(setCurrentTopic(currentTopic));

    if (currentExercises.length === 0) {
      showToast.error({ message: "Вправи не знайдено" });
      return;
    }

    navigate("/exercises-card", { topicId, topicTitle });
  };

  if (!currentTopic) {
    return <Spinner />;
  }

  const progressPercent = calculateProgress(currentTopic);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TopicInfo topic={currentTopic} />

        <ExerciseTopicStatistics
          topic={currentTopic}
          progressPercent={progressPercent}
        />

        <ExerciseLearningOptions onStartLearning={handleStartLearning} />
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          title={isLoading ? "Завантаження..." : "Почати виконання вправ"}
          onPress={handleStartLearning}
          loading={isLoading}
          size="large"
          style={[styles.startButton, { backgroundColor: colors.primary }]}
        />
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
    paddingTop: 70,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  bottomContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.md,
    marginBottom: SIZES.spacing.lg,
  },
  startButton: {
    width: "100%",
  },
});
