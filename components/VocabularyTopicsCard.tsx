import { Topic } from "@/types/vocabulary.type";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import {
  calculateProgress,
  getDifficultyColor,
  getDifficultyLabel,
} from "../utils";

interface VocabularyTopicCardProps {
  topic: Topic;
  onPress: (topicId: string, topicTitle: string) => void;
}

export function VocabularyTopicsCard({
  topic,
  onPress,
}: VocabularyTopicCardProps) {
  const { colors } = useTheme();
  const progressPercent = calculateProgress(topic);

  return (
    <TouchableOpacity
      style={[styles.topicCard, { backgroundColor: colors.surface }]}
      onPress={() => onPress(topic.id, topic.title)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {topic.imageUrl ? (
          <Image source={{ uri: topic.imageUrl }} style={styles.topicImage} />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons name="book" size={32} color={colors.primary} />
          </View>
        )}
      </View>

      <View style={styles.topicInfo}>
        <View style={styles.topicHeader}>
          <Text
            style={[styles.topicTitle, { color: colors.textPrimary }]}
            numberOfLines={2}
          >
            {topic.title}
          </Text>

          <View
            style={[
              styles.difficultyBadge,
              {
                backgroundColor:
                  getDifficultyColor(topic.difficulty, colors) + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                {
                  color: getDifficultyColor(topic.difficulty, colors),
                },
              ]}
            >
              {getDifficultyLabel(topic.difficulty)}
            </Text>
          </View>
        </View>

        <Text
          style={[styles.topicDescription, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {topic.description}
        </Text>

        <View style={styles.progressInfo}>
          <View style={styles.statsRow}>
            <Ionicons
              name="library-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={[styles.statsText, { color: colors.textSecondary }]}>
              {topic.totalItems} слів
            </Text>
          </View>

          <View style={styles.statsRow}>
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color={colors.success}
            />
            <Text style={[styles.statsText, { color: colors.success }]}>
              {topic.completedItems} вивчено
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View
            style={[styles.progressBar, { backgroundColor: colors.border }]}
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
          <Text style={[styles.progressPercent, { color: colors.primary }]}>
            {progressPercent}%
          </Text>
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
