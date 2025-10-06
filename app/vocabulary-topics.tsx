// app/vocabulary-topics.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "../components/TextInput";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchVocabularyTopics } from "../redux/vocabulary/operations";
import { setSearchQuery } from "../redux/vocabulary/slice";
import { calculateProgress } from "../utils";

export default function VocabularyTopicsScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const { filteredTopics, searchQuery, isLoading } = useAppSelector(
    (state) => state.vocabulary
  );

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    dispatch(fetchVocabularyTopics());
  }, [dispatch]);

  const handleSearch = (query: string) => {
    setLocalSearchQuery(query);
    dispatch(setSearchQuery(query));
  };

  const handleTopicPress = (topicId: string, topicTitle: string) => {
    router.push({
      pathname: "/vocabulary-topic" as any,
      params: { topicId, topicTitle },
    });
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

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Завантаження тем...
          </Text>
        </View>
      );
    }

    if (searchQuery && filteredTopics.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="search-outline"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Нічого не знайдено
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Спробуйте змінити пошуковий запит
          </Text>
        </View>
      );
    }

    if (filteredTopics.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="book-outline"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Немає тем
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Теми будуть додані пізніше
          </Text>
        </View>
      );
    }

    return null;
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

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Словник
        </Text>

        <View style={styles.placeholder} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Пошук тем..."
          value={localSearchQuery}
          onChangeText={handleSearch}
          leftIcon={
            <Ionicons name="search" size={20} color={colors.textSecondary} />
          }
          rightIcon={
            localSearchQuery ? (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ) : null
          }
        />
      </View>

      {/* Topics List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTopics.length > 0 ? (
          <View style={styles.topicsList}>
            {filteredTopics.map((topic) => {
              const progressPercent = calculateProgress(
                topic.completedItems,
                topic.totalItems
              );

              return (
                <TouchableOpacity
                  key={topic.id}
                  style={[
                    styles.topicCard,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={() => handleTopicPress(topic.id, topic.title)}
                  activeOpacity={0.7}
                >
                  {/* Topic Image */}
                  <View style={styles.imageContainer}>
                    {topic.imageUrl ? (
                      <Image
                        source={{ uri: topic.imageUrl }}
                        style={styles.topicImage}
                      />
                    ) : (
                      <View
                        style={[
                          styles.imagePlaceholder,
                          { backgroundColor: colors.primary + "20" },
                        ]}
                      >
                        <Ionicons
                          name="book"
                          size={32}
                          color={colors.primary}
                        />
                      </View>
                    )}
                  </View>

                  {/* Topic Info */}
                  <View style={styles.topicInfo}>
                    <View style={styles.topicHeader}>
                      <Text
                        style={[styles.topicTitle, { color: colors.text }]}
                        numberOfLines={2}
                      >
                        {topic.title}
                      </Text>

                      {/* Difficulty Badge */}
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
                            {
                              color: getDifficultyColor(topic.difficulty),
                            },
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

                    {/* Progress Info */}
                    <View style={styles.progressInfo}>
                      <View style={styles.statsRow}>
                        <Ionicons
                          name="library-outline"
                          size={16}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.statsText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {topic.totalItems} слів
                        </Text>
                      </View>

                      <View style={styles.statsRow}>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={16}
                          color={colors.success}
                        />
                        <Text
                          style={[styles.statsText, { color: colors.success }]}
                        >
                          {topic.completedItems} вивчено
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressSection}>
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
                              backgroundColor: colors.primary,
                              width: `${progressPercent}%`,
                            },
                          ]}
                        />
                      </View>
                      <Text
                        style={[
                          styles.progressPercent,
                          { color: colors.primary },
                        ]}
                      >
                        {progressPercent}%
                      </Text>
                    </View>
                  </View>

                  {/* Arrow Icon */}
                  <View style={styles.arrowContainer}>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
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
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xxl,
  },
  topicsList: {
    gap: SIZES.spacing.md,
  },
  topicCard: {
    flexDirection: "row",
    borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    marginRight: SIZES.spacing.md,
  },
  topicImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.borderRadius.md,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: SIZES.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  topicInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  topicHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: SIZES.spacing.xs,
  },
  topicTitle: {
    flex: 1,
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
    marginRight: SIZES.spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: 2,
    borderRadius: SIZES.borderRadius.sm,
  },
  difficultyText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "600",
  },
  topicDescription: {
    fontSize: SIZES.fontSize.sm,
    lineHeight: 18,
    marginBottom: SIZES.spacing.sm,
  },
  progressInfo: {
    flexDirection: "row",
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statsText: {
    fontSize: SIZES.fontSize.xs,
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressPercent: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "600",
    minWidth: 35,
  },
  arrowContainer: {
    justifyContent: "center",
    marginLeft: SIZES.spacing.sm,
  },
  emptyState: {
    flex: 1,
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
  emptyText: {
    fontSize: SIZES.fontSize.lg,
  },
});
