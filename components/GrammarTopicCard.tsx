import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { Topic } from "../types/grammar.type";
import { calculateProgress, getDifficultyColor } from "../utils";

interface GrammarTopicCardProps {
  topic: Topic;
  onPress: (topic: Topic) => void;
}

export function GrammarTopicCard({ topic, onPress }: GrammarTopicCardProps) {
  const { colors } = useTheme();

  const getTopicIcon = (title: string) => {
    if (title.includes("Present")) return "time";
    if (title.includes("Past")) return "arrow-back-circle";
    if (title.includes("Perfect")) return "checkmark-circle";
    if (title.includes("Modal")) return "help-circle";
    if (title.includes("Conditional")) return "git-branch";
    if (title.includes("Passive")) return "swap-horizontal";
    return "school";
  };

  const getStatusBadge = () => {
    if (topic.completedItems === 0) {
      return {
        backgroundColor: colors.textSecondary + "20",
        textColor: colors.textSecondary,
        label: "Не розпочато",
      };
    }
    if (topic.completedItems < topic.totalItems) {
      return {
        backgroundColor: colors.warning + "20",
        textColor: colors.warning,
        label: "В процесі",
      };
    }
    return {
      backgroundColor: colors.success + "20",
      textColor: colors.success,
      label: "Завершено",
    };
  };

  const status = getStatusBadge();

  return (
    <TouchableOpacity
      style={[styles.topicCard, { backgroundColor: colors.surface }]}
      onPress={() => onPress(topic)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.topicIconContainer,
          {
            backgroundColor:
              getDifficultyColor(topic.difficulty, colors) + "20",
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
          style={[styles.topicTitle, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {topic.title}
        </Text>

        <Text
          style={[styles.topicDescription, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {topic.description}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: colors.textPrimary }]}>
              {topic.completedItems}/{topic.totalItems}
            </Text>
            <Text
              style={[
                styles.progressPercent,
                {
                  color: getDifficultyColor(topic.difficulty, colors),
                },
              ]}
            >
              {calculateProgress(topic)}%
            </Text>
          </View>

          <View
            style={[styles.progressBar, { backgroundColor: colors.border }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: getDifficultyColor(topic.difficulty, colors),
                  width: `${calculateProgress(topic)}%`,
                },
              ]}
            />
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: status.backgroundColor },
          ]}
        >
          <Text style={[styles.statusText, { color: status.textColor }]}>
            {status.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
