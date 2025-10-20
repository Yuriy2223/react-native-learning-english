import { GrammarRule, Topic } from "@/types/grammar.type";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { getDifficultyColor } from "../utils";
import { Button } from "./Button";

interface RuleCardProps {
  rule: GrammarRule;
  index: number;
  topic: Topic;
  isExpanded: boolean;
  isCompleted: boolean;
  onToggleExpansion: () => void;
  onCompleteRule: () => void;
}

export function GrammarRuleCard({
  rule,
  index,
  topic,
  isExpanded,
  isCompleted,
  onToggleExpansion,
  onCompleteRule,
}: RuleCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.ruleCard,
        { backgroundColor: colors.background },
        isCompleted && styles.completedCard,
      ]}
    >
      <TouchableOpacity style={styles.ruleHeader} onPress={onToggleExpansion}>
        <View style={styles.ruleHeaderContent}>
          <View
            style={[
              styles.ruleNumber,
              {
                backgroundColor: isCompleted
                  ? colors.success
                  : getDifficultyColor(topic.difficulty, colors),
              },
            ]}
          >
            {isCompleted ? (
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            ) : (
              <Text style={styles.ruleNumberText}>{index + 1}</Text>
            )}
          </View>
          <Text
            style={[
              styles.ruleTitle,
              { color: colors.textPrimary },
              isCompleted && styles.completedText,
            ]}
          >
            {rule.title}
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.ruleContent}>
          <Text
            style={[styles.ruleDescription, { color: colors.textSecondary }]}
          >
            {rule.description}
          </Text>

          {rule.examples.length > 0 && (
            <View style={styles.examplesContainer}>
              <Text
                style={[styles.examplesTitle, { color: colors.textPrimary }]}
              >
                Приклади:
              </Text>
              {rule.examples.map((example, exampleIndex) => (
                <View
                  key={exampleIndex}
                  style={[
                    styles.exampleItem,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.exampleText, { color: colors.textPrimary }]}
                  >
                    {example}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {!isCompleted ? (
            <Button
              title="Правило вивчено"
              onPress={onCompleteRule}
              variant="outline"
              style={[
                styles.completeRuleButton,
                { borderColor: colors.success },
              ]}
              textStyle={{ color: colors.success }}
              size="small"
            />
          ) : (
            <View
              style={[
                styles.completedBadge,
                { backgroundColor: colors.success },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={colors.success}
              />
              <Text style={[styles.completedText, { color: colors.success }]}>
                Вивчено
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ruleCard: {
    borderRadius: SIZES.borderRadius.md,
    overflow: "hidden",
  },
  completedCard: {
    opacity: 0.7,
  },
  ruleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SIZES.spacing.md,
  },
  ruleHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  ruleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.spacing.md,
  },
  ruleNumberText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  ruleTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  ruleContent: {
    padding: SIZES.spacing.md,
    paddingTop: 0,
  },
  ruleDescription: {
    fontSize: SIZES.fontSize.md,
    lineHeight: 22,
    marginBottom: SIZES.spacing.md,
  },
  examplesContainer: {
    marginBottom: SIZES.spacing.md,
  },
  examplesTitle: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: "600",
    marginBottom: SIZES.spacing.sm,
  },
  exampleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: SIZES.spacing.sm,
    marginBottom: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.sm,
  },
  exampleText: {
    fontSize: SIZES.fontSize.sm,
    marginLeft: SIZES.spacing.xs,
    flex: 1,
  },
  completeRuleButton: {
    alignSelf: "flex-start",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.md,
    gap: SIZES.spacing.xs,
  },
});
