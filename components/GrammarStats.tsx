import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { Topic } from "../types/grammar.type";

interface GrammarStatsProps {
  topics: Topic[];
}

export function GrammarStats({ topics }: GrammarStatsProps) {
  const { colors } = useTheme();

  const completedRules = topics.reduce(
    (sum, topic) => sum + topic.completedItems,
    0
  );

  const inProgressTopics = topics.filter(
    (topic) =>
      topic.completedItems > 0 && topic.completedItems < topic.totalItems
  ).length;

  const completedTopics = topics.filter(
    (topic) => topic.totalItems > 0 && topic.completedItems === topic.totalItems
  ).length;

  return (
    <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.statsTitle, { color: colors.textPrimary }]}>
        Прогрес в граматиці
      </Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {completedRules}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Завершено правил
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {inProgressTopics}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            В процесі
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {completedTopics}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Завершено тем
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
