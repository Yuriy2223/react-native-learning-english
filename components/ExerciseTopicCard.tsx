import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SHADOWS, SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { ExerciseTopic } from "../types/exercises.types";
import {
  calculateProgress,
  getDifficultyColor,
  getDifficultyLabel,
  getTopicIcon,
} from "../utils";

interface ExerciseTopicCardProps {
  topic: ExerciseTopic;
  onPress: (topic: ExerciseTopic) => void;
}

export const ExerciseTopicCard = ({
  topic,
  onPress,
}: ExerciseTopicCardProps) => {
  const { colors } = useTheme();
  const progress = calculateProgress(topic);
  const isCompleted = progress === 100;
  const topicIcon = getTopicIcon(topic);
  const difficultyColor = getDifficultyColor(topic.difficulty, colors);
  const difficultyLabel = getDifficultyLabel(topic.difficulty);

  return (
    <TouchableOpacity
      style={[
        styles.topicCard,
        {
          backgroundColor: colors.surface,
          ...SHADOWS.small,
        },
      ]}
      onPress={() => onPress(topic)}
    >
      {topic.imageUrl ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: topic.imageUrl }}
            style={styles.topicImage}
            resizeMode="cover"
          />
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.success}
              />
            </View>
          )}
        </View>
      ) : (
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isCompleted
                ? colors.success + "20"
                : colors.primary + "20",
            },
          ]}
        >
          <Ionicons
            name={isCompleted ? "checkmark-circle" : topicIcon}
            size={32}
            color={isCompleted ? colors.success : colors.primary}
          />
        </View>
      )}

      <View style={styles.topicInfo}>
        <View style={styles.topicHeader}>
          <Text style={[styles.topicTitle, { color: colors.textPrimary }]}>
            {topic.title}
          </Text>

          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: difficultyColor + "20" },
            ]}
          >
            <Text style={[styles.difficultyText, { color: difficultyColor }]}>
              {difficultyLabel}
            </Text>
          </View>
        </View>

        <Text
          style={[styles.topicDescription, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {topic.description}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={16} color={colors.warning} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {topic.earnedScore}/{topic.totalScore}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { backgroundColor: colors.border + "40" },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                    backgroundColor: isCompleted
                      ? colors.success
                      : colors.primary,
                  },
                ]}
              />
            </View>
            <Text
              style={[styles.progressText, { color: colors.textSecondary }]}
            >
              {topic.completedItems}/{topic.totalItems}
            </Text>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topicCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.lg,
    marginBottom: SIZES.spacing.md,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: SIZES.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.spacing.md,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: SIZES.borderRadius.md,
    marginRight: SIZES.spacing.md,
    position: "relative",
    overflow: "hidden",
  },
  topicImage: {
    width: "100%",
    height: "100%",
  },
  completedBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "white",
    borderRadius: 12,
  },
  topicInfo: {
    flex: 1,
  },
  topicHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SIZES.spacing.xs,
  },
  topicTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    flex: 1,
    marginRight: SIZES.spacing.xs,
  },
  difficultyBadge: {
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs / 2,
    borderRadius: SIZES.borderRadius.sm,
  },
  difficultyText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "600",
  },
  topicDescription: {
    fontSize: SIZES.fontSize.sm,
    marginBottom: SIZES.spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.spacing.md,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.spacing.xs,
  },
  statText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "500",
  },
  progressContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "500",
    minWidth: 40,
    textAlign: "right",
  },
});
