import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { ExerciseTopic } from "../types/exercises.types";

interface ExerciseTopicStatisticsProps {
  topic: ExerciseTopic;
  progressPercent: number;
}

export const ExerciseTopicStatistics = ({
  topic,
  progressPercent,
}: ExerciseTopicStatisticsProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.statsTitle, { color: colors.textPrimary }]}>
        Статистика вправ
      </Text>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Ionicons name="game-controller" size={24} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {topic.totalItems}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Всього вправ
          </Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {topic.completedItems}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Виконано
          </Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="trophy" size={24} color={colors.warning} />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {topic.earnedScore}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Балів
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressText, { color: colors.textPrimary }]}>
            Прогрес виконання
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

      <View style={styles.scoreSection}>
        <View style={styles.scoreHeader}>
          <Text style={[styles.scoreText, { color: colors.textPrimary }]}>
            Зароблені бали
          </Text>
          <Text style={[styles.scorePercent, { color: colors.warning }]}>
            {topic.earnedScore}/{topic.totalScore}
          </Text>
        </View>

        <View style={[styles.scoreBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.scoreFill,
              {
                backgroundColor: colors.warning,
                width: `${
                  topic.totalScore > 0
                    ? (topic.earnedScore / topic.totalScore) * 100
                    : 0
                }%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

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
    marginBottom: SIZES.spacing.md,
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
  scoreSection: {
    marginTop: SIZES.spacing.md,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.spacing.sm,
  },
  scoreText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
  },
  scorePercent: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
  scoreBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  scoreFill: {
    height: "100%",
    borderRadius: 4,
  },
});
