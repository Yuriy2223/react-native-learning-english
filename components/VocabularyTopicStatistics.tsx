import { Topic } from "@/types/vocabulary.type";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { calculateProgress } from "../utils";

interface TopicStatisticsProps {
  topic: Topic;
}

export function VocabularyTopicStatistics({ topic }: TopicStatisticsProps) {
  const { colors } = useTheme();
  const progressPercent = calculateProgress(topic);

  return (
    <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.statsTitle, { color: colors.textPrimary }]}>
        Статистика
      </Text>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Ionicons name="library" size={24} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {topic.totalItems}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Всього слів
          </Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {topic.completedItems}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Вивчено
          </Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="trending-up" size={24} color={colors.warning} />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
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
          <Text style={[styles.progressText, { color: colors.textPrimary }]}>
            Прогрес вивчення
          </Text>
          <Text style={[styles.progressPercent, { color: colors.primary }]}>
            {topic.completedItems}/{topic.totalItems}
          </Text>
        </View>

        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
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
});
