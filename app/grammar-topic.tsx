import { ConfirmationModal } from "@/components/ConfirmationModal";
import {
  selectCurrentRules,
  selectLoading,
  selectTopics,
} from "@/redux/grammar/selectors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { GrammarProgressSection } from "../components/GrammarProgressSection";
import { GrammarRulesList } from "../components/GrammarRulesList";
import { GrammarTopicHeader } from "../components/GrammarTopicHeader";
import { SIZES } from "../constants";
import { showToast } from "../hooks/showToast";
import { useTheme } from "../hooks/useTheme";
import {
  fetchGrammarQuestions,
  fetchTopicRules,
  markTopicAsCompleted,
  updateRuleStatus,
} from "../redux/grammar/operations";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { addPoints } from "../redux/user/slice";
import { getDifficultyColor, navigate } from "../utils";

export default function GrammarTopicScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const topicId = params.topicId as string;
  const topics = useAppSelector(selectTopics);
  const currentRules = useAppSelector(selectCurrentRules);
  const isLoading = useAppSelector(selectLoading);
  const currentTopic = topics.find((topic) => topic.id === topicId);
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const completedRuleIds = useMemo(
    () =>
      new Set(
        currentRules.filter((rule) => rule.isCompleted).map((rule) => rule.id)
      ),
    [currentRules]
  );

  useEffect(() => {
    if (topicId) {
      dispatch(fetchTopicRules(topicId));
    }
  }, [topicId, dispatch]);

  const toggleRuleExpansion = (ruleId: string) => {
    setExpandedRules((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(ruleId)) {
        newExpanded.delete(ruleId);
      } else {
        newExpanded.add(ruleId);
      }
      return newExpanded;
    });
  };

  const handleCompleteRule = async (ruleId: string) => {
    if (completedRuleIds.has(ruleId)) {
      return;
    }

    try {
      await dispatch(
        updateRuleStatus({
          ruleId,
          topicId,
          isCompleted: true,
        })
      ).unwrap();

      dispatch(addPoints(20));
      showToast.success({
        message: "Правило вивчено!",
      });
    } catch (error) {
      console.error("Error completing rule:", error);
      showToast.error({
        message: "Помилка при завершенні правила",
      });
    }
  };

  const handleCompleteAllRules = async () => {
    try {
      await dispatch(markTopicAsCompleted(topicId)).unwrap();
      dispatch(addPoints(100));
      showToast.success({
        message: "Вітаємо! Тему граматики завершено!",
        duration: 4000,
      });
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      console.error("Error completing topic:", error);
      showToast.error({
        message: "Помилка при завершенні теми",
      });
    }
  };

  const handleTakeTest = async () => {
    if (currentTopic!.totalItems === 0) {
      showToast.error({
        message: "У цій темі ще немає правил",
      });
      return;
    }

    try {
      const result = await dispatch(fetchGrammarQuestions(topicId)).unwrap();

      if (!result || result.length === 0) {
        showToast.error({
          message: "У цій темі ще немає питань для тестування",
        });
        return;
      }

      if (currentTopic!.completedItems < currentTopic!.totalItems) {
        showToast.info({
          message: `Вивчено ${currentTopic!.completedItems} з ${
            currentTopic!.totalItems
          } правил. Рекомендуємо спочатку завершити тему!`,
          duration: 3000,
        });
      }

      navigate("/grammar-test", {
        topicId: topicId,
        topicTitle: currentTopic!.title,
      });
    } catch (error) {
      console.error("Помилка завантаження питань:", error);
      showToast.error({
        message: "Помилка завантаження питань тесту",
      });
    }
  };

  if (!currentTopic) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
          Тема не знайдена
        </Text>
      </View>
    );
  }

  const isCompleted = currentTopic!.completedItems === currentTopic!.totalItems;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Граматика
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <GrammarTopicHeader topic={currentTopic} />
        <GrammarProgressSection topic={currentTopic} />

        <View
          style={[styles.rulesContainer, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.rulesTitle, { color: colors.textPrimary }]}>
            Граматичні правила
          </Text>

          <GrammarRulesList
            rules={currentRules}
            topic={currentTopic}
            isLoading={isLoading}
            expandedRules={expandedRules}
            completedRuleIds={completedRuleIds}
            onToggleExpansion={toggleRuleExpansion}
            onCompleteRule={handleCompleteRule}
          />
        </View>

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
              onPress={() => setShowCompleteModal(true)}
              style={[
                styles.completeButton,
                {
                  backgroundColor: getDifficultyColor(
                    currentTopic.difficulty,
                    colors
                  ),
                },
              ]}
              size="large"
            />
          )}
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={showCompleteModal}
        title="Завершити тему?"
        message="Ви впевнені, що вивчили всі правила цієї теми?"
        confirmText="Завершити"
        cancelText="Ще попрацюю"
        confirmButtonVariant="primary"
        icon="checkmark-circle"
        iconColor={colors.success}
        onConfirm={handleCompleteAllRules}
        onCancel={() => setShowCompleteModal(false)}
      />
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
    fontSize: SIZES.fontSize.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.md,
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
