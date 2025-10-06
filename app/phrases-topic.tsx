// app/phrases-topic.tsx
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
import { fetchTopicPhrases } from "../redux/phrases/operations";
import { setCurrentTopic } from "../redux/phrases/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { calculateProgress } from "../utils";

export default function PhrasesTopicScreen() {
  const { colors } = useTheme();
  const { showError } = useToast();
  const dispatch = useAppDispatch();

  const params = useLocalSearchParams();
  const topicId = params.topicId as string;
  const topicTitle = params.topicTitle as string;

  const { topics, currentPhrases, isLoading } = useAppSelector(
    (state) => state.phrases
  );

  const currentTopic = topics.find((topic) => topic.id === topicId);

  useEffect(() => {
    if (topicId) {
      dispatch(fetchTopicPhrases(topicId));
    }
  }, [topicId, dispatch]);

  const handleStartLearning = async () => {
    if (!currentTopic) {
      showError({ message: "Тема не знайдена" });
      return;
    }

    try {
      dispatch(setCurrentTopic(currentTopic));

      if (currentPhrases.length === 0) {
        await dispatch(fetchTopicPhrases(topicId)).unwrap();
      }

      if (currentPhrases.length === 0) {
        showError({ message: "Фрази не знайдено" });
        return;
      }

      router.push({
        pathname: "/phrases-card",
        params: { topicId, topicTitle },
      });
    } catch (error) {
      console.error("Error in handleStartLearning:", error);
      showError({
        message: "Помилка завантаження фраз",
      });
    }
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

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Тема фраз
        </Text>

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
                { backgroundColor: colors.secondary },
              ]}
            >
              <Ionicons name="chatbubbles" size={80} color="#FFFFFF" />
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
            Статистика фраз
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="chatbubbles" size={24} color={colors.secondary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {currentTopic.totalItems}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Всього фраз
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
              <Text
                style={[styles.progressPercent, { color: colors.secondary }]}
              >
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
                    backgroundColor: colors.secondary,
                    width: `${progressPercent}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Learning Options */}
        <View
          style={[styles.optionsContainer, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.optionsTitle, { color: colors.text }]}>
            Режими навчання фраз
          </Text>

          <View style={styles.optionsList}>
            <TouchableOpacity
              style={[
                styles.optionItem,
                { backgroundColor: colors.background },
              ]}
              onPress={handleStartLearning}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.optionIcon,
                  { backgroundColor: colors.secondary + "20" },
                ]}
              >
                <Ionicons name="play" size={20} color={colors.secondary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  Вивчення нових фраз
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Послідовно вивчайте корисні фрази з перекладом
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionItem,
                { backgroundColor: colors.background, opacity: 0.6 },
              ]}
              activeOpacity={0.7}
              disabled
            >
              <View
                style={[
                  styles.optionIcon,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Ionicons name="refresh" size={20} color={colors.primary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  Повторення фраз
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Повторіть вже вивчені фрази (незабаром)
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionItem,
                { backgroundColor: colors.background, opacity: 0.6 },
              ]}
              activeOpacity={0.7}
              disabled
            >
              <View
                style={[
                  styles.optionIcon,
                  { backgroundColor: colors.success + "20" },
                ]}
              >
                <Ionicons
                  name="chatbubble-ellipses"
                  size={20}
                  color={colors.success}
                />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  Діалогова практика
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Практикуйте фрази в діалогах (незабаром)
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
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
  optionsContainer: {
    marginHorizontal: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  optionsTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.md,
    textAlign: "center",
  },
  optionsList: {
    gap: SIZES.spacing.sm,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
    marginBottom: SIZES.spacing.xs,
  },
  optionDescription: {
    fontSize: SIZES.fontSize.sm,
    lineHeight: 18,
  },
  bottomContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.md,
  },
  startButton: {
    width: "100%",
  },
});
