import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { Topic } from "../types/grammar.type";
import { getDifficultyColor, getDifficultyLabel } from "../utils";
import { GrammarTopicCard } from "./GrammarTopicCard";

interface GrammarTopicsListProps {
  groupedTopics: Record<string, Topic[]>;
  onTopicPress: (topic: Topic) => void;
}

export function GrammarTopicsList({
  groupedTopics,
  onTopicPress,
}: GrammarTopicsListProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.sections}>
      {Object.entries(groupedTopics).map(([difficulty, difficultyTopics]) => (
        <View key={difficulty} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {getDifficultyLabel(difficulty)}
            </Text>
            <View
              style={[
                styles.difficultyIndicator,
                {
                  backgroundColor: getDifficultyColor(
                    difficulty as Topic["difficulty"],
                    colors
                  ),
                },
              ]}
            />
          </View>

          <View style={styles.topicsGrid}>
            {difficultyTopics.map((topic) => (
              <GrammarTopicCard
                key={topic.id}
                topic={topic}
                onPress={onTopicPress}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sections: {
    gap: SIZES.spacing.xl,
  },
  section: {
    gap: SIZES.spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.spacing.sm,
  },
  sectionTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
  },
  difficultyIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  topicsGrid: {
    gap: SIZES.spacing.md,
  },
});
