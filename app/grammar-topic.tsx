// app/grammar-topic.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
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
import {
  fetchTopicRules,
  markTopicAsCompleted,
} from "../redux/grammar/operations";
import { updateTopicProgress } from "../redux/grammar/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { addPoints } from "../redux/user/slice";
import { calculateProgress } from "../utils";

export default function GrammarTopicScreen() {
  const { colors } = useTheme();
  const { showSuccess, showError } = useToast();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const topicId = params.topicId as string;

  const { topics, currentRules, isLoading } = useAppSelector(
    (state) => state.grammar
  );

  const currentTopic = topics.find((topic) => topic.id === topicId);
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (topicId) {
      dispatch(fetchTopicRules(topicId));
    }
  }, [topicId, dispatch]);

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

  const toggleRuleExpansion = (ruleId: string) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
  };

  const handleCompleteRule = (ruleId: string) => {
    // Додаємо правило як завершене
    dispatch(updateTopicProgress({ topicId, increment: 1 }));
    dispatch(addPoints(20)); // Граматика дає найбільше балів

    showSuccess({
      message: "Правило вивчено! +20 балів",
    });
  };

  const handleCompleteAllRules = () => {
    Alert.alert(
      "Завершити тему",
      "Ви впевнені, що вивчили всі правила цієї теми?",
      [
        {
          text: "Скасувати",
          style: "cancel",
        },
        {
          text: "Завершити",
          style: "default",
          onPress: async () => {
            try {
              await dispatch(markTopicAsCompleted(topicId));
              dispatch(addPoints(100)); // Бонус за завершення теми

              showSuccess({
                message:
                  "Вітаємо! Тему граматики завершено! +100 балів бонусу!",
                duration: 4000,
              });

              setTimeout(() => {
                router.back();
              }, 2000);
            } catch (error) {
              console.error("Error completing topic:", error);
              showError({
                message: "Помилка завершення теми",
              });
            }
          },
        },
      ]
    );
  };

  const handleTakeTest = () => {
    // TODO: Implement grammar test
    showSuccess({
      message: "Тест по граматиці буде доступний незабаром",
    });
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
  const isCompleted = currentTopic.completedItems === currentTopic.totalItems;

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
          Граматика
        </Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Topic Header */}
        <View style={[styles.topicHeader, { backgroundColor: colors.surface }]}>
          <View
            style={[
              styles.topicIcon,
              { backgroundColor: getDifficultyColor(currentTopic.difficulty) },
            ]}
          >
            <Ionicons name="school" size={32} color="#FFFFFF" />
          </View>

          <Text style={[styles.topicTitle, { color: colors.text }]}>
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
                  getDifficultyColor(currentTopic.difficulty) + "20",
              },
            ]}
          >
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

        {/* Progress Section */}
        <View
          style={[
            styles.progressContainer,
            { backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.progressTitle, { color: colors.text }]}>
            Прогрес вивчення
          </Text>

          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: colors.text }]}>
              {currentTopic.completedItems} з {currentTopic.totalItems} правил
            </Text>
            <Text
              style={[
                styles.progressPercent,
                { color: getDifficultyColor(currentTopic.difficulty) },
              ]}
            >
              {progressPercent}%
            </Text>
          </View>

          <View
            style={[styles.progressBar, { backgroundColor: colors.border }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: getDifficultyColor(currentTopic.difficulty),
                  width: `${progressPercent}%`,
                },
              ]}
            />
          </View>

          {isCompleted && (
            <View
              style={[
                styles.completedBadge,
                { backgroundColor: colors.success + "20" },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.success}
              />
              <Text style={[styles.completedText, { color: colors.success }]}>
                Тема завершена!
              </Text>
            </View>
          )}
        </View>

        {/* Grammar Rules */}
        <View
          style={[styles.rulesContainer, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.rulesTitle, { color: colors.text }]}>
            Граматичні правила
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text
                style={[styles.loadingText, { color: colors.textSecondary }]}
              >
                Завантаження правил...
              </Text>
            </View>
          ) : (
            <View style={styles.rulesList}>
              {currentRules.map((rule, index) => (
                <View
                  key={rule.id}
                  style={[
                    styles.ruleCard,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.ruleHeader}
                    onPress={() => toggleRuleExpansion(rule.id)}
                  >
                    <View style={styles.ruleHeaderContent}>
                      <View
                        style={[
                          styles.ruleNumber,
                          {
                            backgroundColor: getDifficultyColor(
                              currentTopic.difficulty
                            ),
                          },
                        ]}
                      >
                        <Text style={styles.ruleNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={[styles.ruleTitle, { color: colors.text }]}>
                        {rule.title}
                      </Text>
                    </View>
                    <Ionicons
                      name={
                        expandedRules.has(rule.id)
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>

                  {expandedRules.has(rule.id) && (
                    <View style={styles.ruleContent}>
                      <Text
                        style={[
                          styles.ruleDescription,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {rule.description}
                      </Text>

                      {rule.examples.length > 0 && (
                        <View style={styles.examplesContainer}>
                          <Text
                            style={[
                              styles.examplesTitle,
                              { color: colors.text },
                            ]}
                          >
                            Приклади:
                          </Text>
                          {rule.examples.map((example, exampleIndex) => (
                            <View
                              key={exampleIndex}
                              style={[
                                styles.exampleItem,
                                { backgroundColor: colors.surface },
                              ]}
                            >
                              <Ionicons
                                name="arrow-forward"
                                size={14}
                                color={colors.primary}
                              />
                              <Text
                                style={[
                                  styles.exampleText,
                                  { color: colors.text },
                                ]}
                              >
                                {example}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}

                      <Button
                        title="Правило вивчено"
                        onPress={() => handleCompleteRule(rule.id)}
                        variant="outline"
                        style={[
                          styles.completeRuleButton,
                          { borderColor: colors.success },
                        ]}
                        textStyle={{ color: colors.success }}
                        size="small"
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Пройти тест"
            onPress={handleTakeTest}
            variant="outline"
            style={[styles.testButton, { borderColor: colors.primary }]}
            size="large"
          />

          {!isCompleted && (
            <Button
              title="Завершити тему"
              onPress={handleCompleteAllRules}
              style={[
                styles.completeButton,
                {
                  backgroundColor: getDifficultyColor(currentTopic.difficulty),
                },
              ]}
              size="large"
            />
          )}
        </View>
      </ScrollView>
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
  topicHeader: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
    alignItems: "center",
  },
  topicIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.spacing.md,
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
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.md,
  },
  difficultyText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: "600",
  },
  progressContainer: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  progressTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.md,
    textAlign: "center",
  },
  progressInfo: {
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
    marginBottom: SIZES.spacing.md,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.md,
  },
  completedText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: "600",
    marginLeft: SIZES.spacing.xs,
  },
  rulesContainer: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  rulesTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.md,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: SIZES.spacing.xl,
  },
  rulesList: {
    gap: SIZES.spacing.md,
  },
  ruleCard: {
    borderRadius: SIZES.borderRadius.md,
    overflow: "hidden",
  },
  ruleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SIZES.spacing.md,
  },
  ruleHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  ruleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.spacing.md,
  },
  ruleNumberText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  ruleTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
    flex: 1,
  },
  ruleContent: {
    padding: SIZES.spacing.md,
    paddingTop: 0,
  },
  ruleDescription: {
    fontSize: SIZES.fontSize.md,
    lineHeight: 22,
    marginBottom: SIZES.spacing.md,
  },
  examplesContainer: {
    marginBottom: SIZES.spacing.md,
  },
  examplesTitle: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: "600",
    marginBottom: SIZES.spacing.sm,
  },
  exampleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: SIZES.spacing.sm,
    marginBottom: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.sm,
  },
  exampleText: {
    fontSize: SIZES.fontSize.sm,
    marginLeft: SIZES.spacing.xs,
    flex: 1,
  },
  completeRuleButton: {
    alignSelf: "flex-start",
  },
  actionsContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    gap: SIZES.spacing.md,
  },
  testButton: {
    width: "100%",
  },
  completeButton: {
    width: "100%",
  },
});
