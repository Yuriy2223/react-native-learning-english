import { Spinner } from "@/components/Spinner";
import {
  selectCurrentPhrases,
  selectLoading,
  selectTopics,
} from "@/redux/phrases/selectors";
import { calculateProgress, navigate } from "@/utils";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button } from "../components/Button";
import { LearningOptions } from "../components/LearningOptions";
import { TopicInfo } from "../components/TopicInfo";
import { TopicStatistics } from "../components/TopicStatistics";
import { SIZES } from "../constants";
import { showToast } from "../hooks/showToast";
import { useTheme } from "../hooks/useTheme";
import { fetchTopicPhrases } from "../redux/phrases/operations";
import { setCurrentTopic } from "../redux/phrases/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export default function PhrasesTopicScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const topicId = params.topicId as string;
  const topicTitle = params.topicTitle as string;
  const topics = useAppSelector(selectTopics);
  const currentPhrases = useAppSelector(selectCurrentPhrases);
  const isLoading = useAppSelector(selectLoading);
  const currentTopic = topics.find((topic) => topic.id === topicId);

  useEffect(() => {
    if (topicId) {
      dispatch(fetchTopicPhrases(topicId));
    }
  }, [topicId, dispatch]);

  const handleStartLearning = async () => {
    if (!currentTopic) {
      showToast.error({ message: "Тема не знайдена" });
      return;
    }

    try {
      dispatch(setCurrentTopic(currentTopic));

      if (currentPhrases.length === 0) {
        await dispatch(fetchTopicPhrases(topicId)).unwrap();
      }

      if (currentPhrases.length === 0) {
        showToast.error({ message: "Фрази не знайдено" });
        return;
      }

      navigate("/phrases-card", {
        topicId,
        topicTitle,
      });
    } catch (error) {
      console.error("Error in handleStartLearning:", error);
      showToast.error({
        message: "Помилка завантаження фраз",
      });
    }
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

        <TopicStatistics
          topic={currentTopic}
          progressPercent={progressPercent}
        />

        <LearningOptions onStartLearning={handleStartLearning} />
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          title={isLoading ? "Завантаження..." : "Почати вивчення фраз"}
          onPress={handleStartLearning}
          loading={isLoading}
          size="large"
          style={[styles.startButton, { backgroundColor: colors.secondary }]}
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
