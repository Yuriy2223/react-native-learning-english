import { TestResult } from "@/types/grammar.type";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface GrammarTestResultItemProps {
  result: TestResult["correctAnswers"][0];
  questionNumber: number;
}

export function GrammarTestResultItem({
  result,
  questionNumber,
}: GrammarTestResultItemProps) {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const optionLabels = ["A", "B", "C", "D"];
  const isCorrect = result.isCorrect;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: isCorrect ? colors.success : colors.error,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <View
            style={[
              styles.numberBadge,
              {
                backgroundColor: isCorrect
                  ? colors.success + "20"
                  : colors.error + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.numberText,
                { color: isCorrect ? colors.success : colors.error },
              ]}
            >
              {questionNumber}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <Ionicons
                name={isCorrect ? "checkmark-circle" : "close-circle"}
                size={20}
                color={isCorrect ? colors.success : colors.error}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isCorrect ? colors.success : colors.error },
                ]}
              >
                {isCorrect ? "Правильно" : "Неправильно"}
              </Text>
            </View>

            {!isCorrect && (
              <Text
                style={[styles.answersText, { color: colors.textSecondary }]}
              >
                Ваша відповідь: {optionLabels[result.userAnswer]} | Правильна:{" "}
                {optionLabels[result.correctAnswer]}
              </Text>
            )}
          </View>
        </View>

        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {isExpanded && result.explanation && (
        <View
          style={[
            styles.explanationContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Text
            style={[styles.explanationTitle, { color: colors.textPrimary }]}
          >
            💡 Пояснення:
          </Text>
          <Text
            style={[styles.explanationText, { color: colors.textSecondary }]}
          >
            {result.explanation}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.borderRadius.md,
    borderWidth: 2,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SIZES.spacing.md,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: SIZES.spacing.md,
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "bold",
  },
  statusContainer: {
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.spacing.xs,
    marginBottom: SIZES.spacing.xs,
  },
  statusText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
  answersText: {
    fontSize: SIZES.fontSize.sm,
  },
  explanationContainer: {
    padding: SIZES.spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  explanationTitle: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: "600",
    marginBottom: SIZES.spacing.xs,
  },
  explanationText: {
    fontSize: SIZES.fontSize.sm,
    lineHeight: 20,
  },
});
