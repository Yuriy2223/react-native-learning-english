import { Topic } from "@/types/grammar.type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { fetchGrammarTopics } from "../redux/grammar/operations";
import {
  selectFilteredTopics,
  selectGroupedTopics,
  selectLoading,
  selectTopics,
} from "../redux/grammar/selectors";
import { setSearchQuery } from "../redux/grammar/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  calculateProgress,
  getDifficultyColor,
  getDifficultyLabel,
} from "../utils";

export default function GrammarTopicsScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const topics = useAppSelector(selectTopics);
  const filteredTopics = useAppSelector(selectFilteredTopics);
  const groupedTopics = useAppSelector(selectGroupedTopics);
  const isLoading = useAppSelector(selectLoading);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchGrammarTopics());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSearchQuery(localSearchQuery));
  }, [localSearchQuery, dispatch]);

  const handleTopicPress = (topic: Topic) => {
    router.push({
      pathname: "/grammar-topic",
      params: {
        topicId: topic.id,
      },
    } as any);
  };

  const getTopicIcon = (title: string) => {
    if (title.includes("Present")) return "time";
    if (title.includes("Past")) return "arrow-back-circle";
    if (title.includes("Perfect")) return "checkmark-circle";
    if (title.includes("Modal")) return "help-circle";
    if (title.includes("Conditional")) return "git-branch";
    if (title.includes("Passive")) return "swap-horizontal";
    return "school";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.searchContainer, { backgroundColor: colors.surface }]}
      >
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <RNTextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Пошук граматичних тем..."
          placeholderTextColor={colors.textSecondary}
          value={localSearchQuery}
          onChangeText={setLocalSearchQuery}
        />
        {localSearchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setLocalSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View
        style={[styles.statsContainer, { backgroundColor: colors.surface }]}
      >
        <Text style={[styles.statsTitle, { color: colors.textPrimary }]}>
          Прогрес в граматиці
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.success }]}>
              {topics.reduce((sum, topic) => sum + topic.completedItems, 0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Завершено правил
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.warning }]}>
              {
                topics.filter(
                  (topic) =>
                    topic.completedItems > 0 &&
                    topic.completedItems < topic.totalItems
                ).length
              }
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              В процесі
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {
                topics.filter(
                  (topic) => topic.completedItems === topic.totalItems
                ).length
              }
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Завершено тем
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.topicsList}
        contentContainerStyle={styles.topicsContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Завантаження тем...
            </Text>
          </View>
        ) : filteredTopics.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="school" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              {localSearchQuery.trim() ? "Нічого не знайдено" : "Немає тем"}
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.textSecondary }]}
            >
              {localSearchQuery.trim()
                ? "Спробуйте змінити пошуковий запит"
                : "Граматичні теми будуть додані пізніше"}
            </Text>
          </View>
        ) : (
          <View style={styles.sections}>
            {Object.entries(groupedTopics).map(
              ([difficulty, difficultyTopics]) => (
                <View key={difficulty} style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {getDifficultyLabel(difficulty)}
                    </Text>
                    <View
                      style={[
                        styles.difficultyIndicator,
                        {
                          backgroundColor: getDifficultyColor(
                            difficulty as Topic["difficulty"],
                            colors
                          ),
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.topicsGrid}>
                    {difficultyTopics.map((topic) => (
                      <TouchableOpacity
                        key={topic.id}
                        style={[
                          styles.topicCard,
                          { backgroundColor: colors.surface },
                        ]}
                        onPress={() => handleTopicPress(topic)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.topicIconContainer,
                            {
                              backgroundColor:
                                getDifficultyColor(topic.difficulty, colors) +
                                "20",
                            },
                          ]}
                        >
                          <Ionicons
                            name={getTopicIcon(topic.title) as any}
                            size={24}
                            color={getDifficultyColor(topic.difficulty, colors)}
                          />
                        </View>

                        <View style={styles.topicContent}>
                          <Text
                            style={[
                              styles.topicTitle,
                              { color: colors.textPrimary },
                            ]}
                            numberOfLines={1}
                          >
                            {topic.title}
                          </Text>

                          <Text
                            style={[
                              styles.topicDescription,
                              { color: colors.textSecondary },
                            ]}
                            numberOfLines={2}
                          >
                            {topic.description}
                          </Text>

                          <View style={styles.progressContainer}>
                            <View style={styles.progressInfo}>
                              <Text
                                style={[
                                  styles.progressText,
                                  { color: colors.textPrimary },
                                ]}
                              >
                                {topic.completedItems}/{topic.totalItems}
                              </Text>
                              <Text
                                style={[
                                  styles.progressPercent,
                                  {
                                    color: getDifficultyColor(
                                      topic.difficulty,
                                      colors
                                    ),
                                  },
                                ]}
                              >
                                {calculateProgress(topic)}%
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
                                    backgroundColor: getDifficultyColor(
                                      topic.difficulty,
                                      colors
                                    ),
                                    width: `${calculateProgress(topic)}%`,
                                  },
                                ]}
                              />
                            </View>
                          </View>

                          {topic.completedItems === 0 && (
                            <View
                              style={[
                                styles.statusBadge,
                                {
                                  backgroundColor: colors.textSecondary + "20",
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.statusText,
                                  { color: colors.textSecondary },
                                ]}
                              >
                                Не розпочато
                              </Text>
                            </View>
                          )}
                          {topic.completedItems > 0 &&
                            topic.completedItems < topic.totalItems && (
                              <View
                                style={[
                                  styles.statusBadge,
                                  { backgroundColor: colors.warning + "20" },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.statusText,
                                    { color: colors.warning },
                                  ]}
                                >
                                  В процесі
                                </Text>
                              </View>
                            )}
                          {topic.completedItems === topic.totalItems && (
                            <View
                              style={[
                                styles.statusBadge,
                                { backgroundColor: colors.success + "20" },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.statusText,
                                  { color: colors.success },
                                ]}
                              >
                                Завершено
                              </Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SIZES.spacing.lg,
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.md,
    gap: SIZES.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.fontSize.md,
    paddingVertical: SIZES.spacing.xs,
  },
  statsContainer: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  statsTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
    marginBottom: SIZES.spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: SIZES.fontSize.xxl,
    fontWeight: "700",
    marginBottom: SIZES.spacing.xs,
  },
  statLabel: {
    fontSize: SIZES.fontSize.sm,
    textAlign: "center",
  },
  topicsList: {
    flex: 1,
  },
  topicsContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xl,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: SIZES.spacing.xxl * 2,
  },
  loadingText: {
    fontSize: SIZES.fontSize.lg,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.xs,
  },
  emptySubtitle: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
    paddingHorizontal: SIZES.spacing.xl,
  },
  sections: {
    gap: SIZES.spacing.xl,
  },
  section: {
    gap: SIZES.spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.spacing.sm,
  },
  sectionTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
  },
  difficultyIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  topicsGrid: {
    gap: SIZES.spacing.md,
  },
  topicCard: {
    flexDirection: "row",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.lg,
    gap: SIZES.spacing.md,
  },
  topicIconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  topicContent: {
    flex: 1,
    gap: SIZES.spacing.xs,
  },
  topicTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
  topicDescription: {
    fontSize: SIZES.fontSize.sm,
    lineHeight: 18,
  },
  progressContainer: {
    marginTop: SIZES.spacing.xs,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.spacing.xs,
  },
  progressText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "500",
  },
  progressPercent: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "600",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.sm,
    marginTop: SIZES.spacing.xs,
  },
  statusText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "600",
  },
});
