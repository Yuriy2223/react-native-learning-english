import {
  selectCurrentWords,
  selectLoading,
  selectTopics,
} from "@/redux/vocabulary/selectors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { VocabularyTopicStatistics } from "../components/VocabularyTopicStatistics";
import { SIZES } from "../constants";
import { showToast } from "../hooks/showToast";
import { useTheme } from "../hooks/useTheme";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchTopicWords } from "../redux/vocabulary/operations";
import { setCurrentTopic } from "../redux/vocabulary/slice";
import { getDifficultyColor, getDifficultyLabel, navigate } from "../utils";

export default function VocabularyTopicScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const topicId = params.topicId as string;
  const topicTitle = params.topicTitle as string;
  const topics = useAppSelector(selectTopics);
  const currentWords = useAppSelector(selectCurrentWords);
  const isLoading = useAppSelector(selectLoading);
  const currentTopic = topics.find((topic) => topic.id === topicId);

  useEffect(() => {
    if (topicId) {
      dispatch(fetchTopicWords(topicId));
    }
  }, [topicId, dispatch]);

  const handleStartLearning = async () => {
    if (!currentTopic) {
      showToast.error({ message: "Тема не знайдена" });
      return;
    }

    try {
      dispatch(setCurrentTopic(currentTopic));

      if (currentWords.length === 0) {
        await dispatch(fetchTopicWords(topicId)).unwrap();
      }

      if (currentWords.length === 0) {
        showToast.error({ message: "Слова не знайдено" });
        return;
      }

      navigate("/vocabulary-card", { topicId, topicTitle });
    } catch (error) {
      console.error("Error in handleStartLearning:", error);
      showToast.error({
        message: "Помилка завантаження слів",
      });
    }
  };

  const handleBackToTopics = () => {
    navigate("/vocabulary-topics");
  };

  if (!currentTopic) {
    return (
      <View
        style={[
          styles.container,
          styles.loading,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
          Тема не знайдена
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Тема
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          {currentTopic.imageUrl ? (
            <Image
              source={{ uri: currentTopic.imageUrl }}
              style={styles.topicImage}
            />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons name="book" size={80} color="#FFFFFF" />
            </View>
          )}
        </View>

        <View
          style={[styles.infoContainer, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.topicTitle, { color: colors.textPrimary }]}>
            {currentTopic.title}
          </Text>

          <Text
            style={[styles.topicDescription, { color: colors.textSecondary }]}
          >
            {currentTopic.description}
          </Text>

          <View
            style={[
              styles.difficultyBadge,
              {
                backgroundColor:
                  getDifficultyColor(currentTopic.difficulty, colors) + "20",
              },
            ]}
          >
            <Ionicons
              name="ribbon"
              size={16}
              color={getDifficultyColor(currentTopic.difficulty, colors)}
            />
            <Text
              style={[
                styles.difficultyText,
                { color: getDifficultyColor(currentTopic.difficulty, colors) },
              ]}
            >
              {getDifficultyLabel(currentTopic.difficulty)}
            </Text>
          </View>
        </View>

        <VocabularyTopicStatistics topic={currentTopic} />
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          size="large"
          title="Всі теми"
          variant="outline"
          style={styles.allButton}
          onPress={handleBackToTopics}
        />

        <Button
          title={isLoading ? "Завантаження..." : "Почати навчання"}
          onPress={handleStartLearning}
          loading={isLoading}
          size="large"
          style={styles.startButton}
        />
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
  },
  loadingText: {
    fontSize: SIZES.fontSize.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.xxl,
    paddingBottom: SIZES.spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: SIZES.spacing.lg,
  },
  topicImage: {
    width: 200,
    height: 200,
    borderRadius: SIZES.borderRadius.xl,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: SIZES.borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  topicTitle: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: SIZES.spacing.sm,
  },
  topicDescription: {
    fontSize: SIZES.fontSize.md,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: SIZES.spacing.md,
  },
  difficultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.md,
  },
  difficultyText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: "600",
    marginLeft: SIZES.spacing.xs,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xxl,
    paddingTop: SIZES.spacing.md,
  },
  startButton: {
    width: "55%",
    alignSelf: "center",
  },
  allButton: {
    width: "35%",
    alignSelf: "center",
  },
});
