// app/vocabulary-topic.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  Image,
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
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchTopicWords } from "../redux/vocabulary/operations";
import { setCurrentTopic } from "../redux/vocabulary/slice";
import { calculateProgress, navigate } from "../utils";

export default function VocabularyTopicScreen() {
  const { colors } = useTheme();
  const { showError } = useToast();
  const dispatch = useAppDispatch();

  const params = useLocalSearchParams();
  const topicId = params.topicId as string;
  const topicTitle = params.topicTitle as string;

  const { topics, currentWords, isLoading } = useAppSelector(
    (state) => state.vocabulary
  );

  const currentTopic = topics.find((topic) => topic.id === topicId);

  useEffect(() => {
    if (topicId) {
      dispatch(fetchTopicWords(topicId));
    }
  }, [topicId, dispatch]);

  const handleStartLearning = async () => {
    if (!currentTopic) {
      showError({ message: "Тема не знайдена" });
      return;
    }

    try {
      // Встановлюємо currentTopic в Redux перед навігацією
      dispatch(setCurrentTopic(currentTopic));

      // Завантажуємо слова якщо їх ще немає
      if (currentWords.length === 0) {
        await dispatch(fetchTopicWords(topicId)).unwrap();
      }

      // Перевіряємо чи слова завантажилися
      if (currentWords.length === 0) {
        showError({ message: "Слова не знайдено" });
        return;
      }

      // Переходимо на екран з картками
      // router.push({
      //   pathname: "/vocabulary-card",
      //   params: { topicId, topicTitle },
      // });
      navigate("/vocabulary-card", { topicId, topicTitle });
    } catch (error) {
      console.error("Error in handleStartLearning:", error);
      showError({
        message: "Помилка завантаження слів",
      });
    }
  };

  const handleBackToTopics = () => {
    // router.push("/vocabulary-topics");
    navigate("/vocabulary-topics");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return colors.success;
      case "intermediate":
        return colors.warning;
      case "advanced":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Початковий";
      case "intermediate":
        return "Середній";
      case "advanced":
        return "Складний";
      default:
        return "";
    }
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
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Тема не знайдена
        </Text>
      </View>
    );
  }

  const progressPercent = calculateProgress(
    currentTopic.completedItems,
    currentTopic.totalItems
  );

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

        <Text style={[styles.headerTitle, { color: colors.text }]}>Тема</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Topic Image */}
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

        {/* Topic Info */}
        <View
          style={[styles.infoContainer, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.topicTitle, { color: colors.text }]}>
            {currentTopic.title}
          </Text>

          <Text
            style={[styles.topicDescription, { color: colors.textSecondary }]}
          >
            {currentTopic.description}
          </Text>

          {/* Difficulty Badge */}
          <View
            style={[
              styles.difficultyBadge,
              {
                backgroundColor:
                  getDifficultyColor(currentTopic.difficulty) + "20",
              },
            ]}
          >
            <Ionicons
              name="ribbon"
              size={16}
              color={getDifficultyColor(currentTopic.difficulty)}
            />
            <Text
              style={[
                styles.difficultyText,
                { color: getDifficultyColor(currentTopic.difficulty) },
              ]}
            >
              {getDifficultyLabel(currentTopic.difficulty)}
            </Text>
          </View>
        </View>

        {/* Statistics */}
        <View
          style={[styles.statsContainer, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.statsTitle, { color: colors.text }]}>
            Статистика
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="library" size={24} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {currentTopic.totalItems}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Всього слів
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.success}
              />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {currentTopic.completedItems}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Вивчено
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={24} color={colors.warning} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {progressPercent}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Прогрес
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressText, { color: colors.text }]}>
                Прогрес вивчення
              </Text>
              <Text style={[styles.progressPercent, { color: colors.primary }]}>
                {currentTopic.completedItems}/{currentTopic.totalItems}
              </Text>
            </View>

            <View
              style={[styles.progressBar, { backgroundColor: colors.border }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${progressPercent}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
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
  placeholder: {
    width: 40,
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
  statsContainer: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  statsTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.md,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: SIZES.spacing.lg,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    marginTop: SIZES.spacing.sm,
    marginBottom: SIZES.spacing.xs,
  },
  statLabel: {
    fontSize: SIZES.fontSize.sm,
    textAlign: "center",
  },
  progressSection: {
    marginTop: SIZES.spacing.md,
  },
  progressHeader: {
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
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.lg,
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
