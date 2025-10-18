import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface GrammarEmptyStateProps {
  hasSearchQuery: boolean;
}

export function GrammarEmptyState({ hasSearchQuery }: GrammarEmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.emptyState}>
      <Ionicons name="school" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
        {hasSearchQuery ? "Нічого не знайдено" : "Немає тем"}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {hasSearchQuery
          ? "Спробуйте змінити пошуковий запит"
          : "Граматичні теми будуть додані пізніше"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.xs,
  },
  emptySubtitle: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
    paddingHorizontal: SIZES.spacing.xl,
  },
});
