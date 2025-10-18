import { GrammarRule, Topic } from "@/types/grammar.type";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { GrammarRuleCard } from "./GrammarRuleCard";

interface RulesListProps {
  rules: GrammarRule[];
  topic: Topic;
  isLoading: boolean;
  expandedRules: Set<string>;
  onToggleExpansion: (ruleId: string) => void;
  onCompleteRule: (ruleId: string) => void;
}

export function GrammarRulesList({
  rules,
  topic,
  isLoading,
  expandedRules,
  onToggleExpansion,
  onCompleteRule,
}: RulesListProps) {
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Завантаження правил...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.rulesList}>
      {rules.map((rule, index) => (
        <GrammarRuleCard
          key={rule.id}
          rule={rule}
          index={index}
          topic={topic}
          isExpanded={expandedRules.has(rule.id)}
          onToggleExpansion={() => onToggleExpansion(rule.id)}
          onCompleteRule={() => onCompleteRule(rule.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    paddingVertical: SIZES.spacing.xl,
  },
  loadingText: {
    fontSize: SIZES.fontSize.md,
  },
  rulesList: {
    gap: SIZES.spacing.md,
  },
});
