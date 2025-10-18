import { Topic } from "@/types/grammar.type";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { getDifficultyColor, getDifficultyLabel } from "../utils";

interface GrammarTopicHeaderProps {
  topic: Topic;
}

export function GrammarTopicHeader({ topic }: GrammarTopicHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.topicHeader, { backgroundColor: colors.surface }]}>
      <View
        style={[
          styles.topicIcon,
          {
            backgroundColor: getDifficultyColor(topic.difficulty, colors),
          },
        ]}
      >
        <Ionicons name="school" size={32} color="#FFFFFF" />
      </View>

      <Text style={[styles.topicTitle, { color: colors.textPrimary }]}>
        {topic.title}
      </Text>

      <Text style={[styles.topicDescription, { color: colors.textSecondary }]}>
        {topic.description}
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
            { color: getDifficultyColor(topic.difficulty, colors) },
          ]}
        >
          {getDifficultyLabel(topic.difficulty)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
