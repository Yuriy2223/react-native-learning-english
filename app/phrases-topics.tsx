// app/phrases-topics.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SHADOWS, SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";
import { fetchPhrasesTopics } from "../redux/phrases/operations";
import { setSearchQuery } from "../redux/phrases/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { Topic } from "../types";
import { calculateProgress, navigate } from "../utils";

export default function PhrasesTopicsScreen() {
  const { colors } = useTheme();
  const { showError } = useToast();
  const dispatch = useAppDispatch();

  const { filteredTopics, searchQuery, isLoading, isError } = useAppSelector(
    (state) => state.phrases
  );

  useEffect(() => {
    dispatch(fetchPhrasesTopics());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      showError({ message: isError });
    }
  }, [isError, showError]);

  // const handleTopicPress = (topic: Topic) => {
  //   router.push({
  //     pathname: "/phrases-topic",
  //     params: {
  //       topicId: topic.id,
  //       topicTitle: topic.title,
  //     },
  //   });
  // };
  const handleTopicPress = (topic: Topic) => {
    navigate("/phrases-topic", {
      topicId: topic.id,
      topicTitle: topic.title,
    });
  };

  const handleSearchChange = (text: string) => {
    dispatch(setSearchQuery(text));
  };

  const handleClearSearch = () => {
    dispatch(setSearchQuery(""));
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

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Завантаження тем...
        </Text>
      </View>
    );
  }

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
          💬 Фрази
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search */}
      <View
        style={[styles.searchContainer, { backgroundColor: colors.surface }]}
      >
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <RNTextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Пошук фраз..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Topics List */}
      <ScrollView
        style={styles.topicsList}
        contentContainerStyle={styles.topicsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTopics.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="chatbubbles-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {searchQuery.trim() ? "Нічого не знайдено" : "Немає тем"}
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.textSecondary }]}
            >
              {searchQuery.trim()
                ? "Спробуйте змінити пошуковий запит"
                : "Теми фраз будуть додані пізніше"}
            </Text>
          </View>
        ) : (
          filteredTopics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={[styles.topicCard, { backgroundColor: colors.surface }]}
              onPress={() => handleTopicPress(topic)}
              activeOpacity={0.7}
            >
              <View style={styles.topicCardContent}>
                <View style={styles.topicHeader}>
                  <Text style={[styles.topicTitle, { color: colors.text }]}>
                    {topic.title}
                  </Text>
                  <View
                    style={[
                      styles.difficultyBadge,
                      {
                        backgroundColor:
                          getDifficultyColor(topic.difficulty) + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        { color: getDifficultyColor(topic.difficulty) },
                      ]}
                    >
                      {getDifficultyLabel(topic.difficulty)}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.topicDescription,
                    { color: colors.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  {topic.description}
                </Text>

                {/* Progress */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressInfo}>
                    <Text style={[styles.progressText, { color: colors.text }]}>
                      {topic.completedItems}/{topic.totalItems} фраз
                    </Text>
                    <Text
                      style={[
                        styles.progressPercent,
                        { color: getDifficultyColor(topic.difficulty) },
                      ]}
                    >
                      {calculateProgress(
                        topic.completedItems,
                        topic.totalItems
                      )}
                      %
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.progressBar,
                      { backgroundColor: colors.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: colors.secondary,
                          width: `${calculateProgress(
                            topic.completedItems,
                            topic.totalItems
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: SIZES.spacing.md,
    fontSize: SIZES.fontSize.md,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.spacing.sm,
    fontSize: SIZES.fontSize.md,
    height: 40,
  },
  topicsList: {
    flex: 1,
  },
  topicsContent: {
    padding: SIZES.spacing.lg,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginTop: SIZES.spacing.md,
    marginBottom: SIZES.spacing.xs,
  },
  emptySubtitle: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
  },
  topicCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    marginBottom: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.lg,
    ...SHADOWS.medium,
  },
  topicCardContent: {
    flex: 1,
    marginRight: SIZES.spacing.sm,
  },
  topicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.spacing.xs,
  },
  topicTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
    flex: 1,
    marginRight: SIZES.spacing.sm,
  },
  topicDescription: {
    fontSize: SIZES.fontSize.sm,
    lineHeight: 18,
    marginBottom: SIZES.spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: 2,
    borderRadius: SIZES.borderRadius.sm,
  },
  difficultyText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "500",
  },
  progressContainer: {
    marginTop: SIZES.spacing.xs,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.spacing.xs,
  },
  progressText: {
    fontSize: SIZES.fontSize.sm,
  },
  progressPercent: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: "600",
  },
  progressBar: {
    height: 3,
    borderRadius: 1.5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 1.5,
  },
});
