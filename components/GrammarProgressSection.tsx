import { Topic } from "@/types/grammar.type";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { calculateProgress, getDifficultyColor } from "../utils";

interface ProgressSectionProps {
  topic: Topic;
}

export function GrammarProgressSection({ topic }: ProgressSectionProps) {
  const { colors } = useTheme();
  const progressPercent = calculateProgress(topic);
  const isCompleted = topic.completedItems === topic.totalItems;

  return (
    <View
      style={[styles.progressContainer, { backgroundColor: colors.surface }]}
    >
      <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>
        Прогрес вивчення
      </Text>

      <View style={styles.progressInfo}>
        <Text style={[styles.progressText, { color: colors.textPrimary }]}>
          {topic.completedItems} з {topic.totalItems} правил
        </Text>
        <Text
          style={[
            styles.progressPercent,
            { color: getDifficultyColor(topic.difficulty, colors) },
          ]}
        >
          {progressPercent}%
        </Text>
      </View>

      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: getDifficultyColor(topic.difficulty, colors),
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
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={[styles.completedText, { color: colors.success }]}>
            Тема завершена!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
