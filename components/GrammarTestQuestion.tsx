import { GrammarQuestion } from "@/types/grammar.type";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface GrammarTestQuestionProps {
  question: GrammarQuestion;
  questionNumber: number;
  selectedAnswer: number;
  onSelectAnswer: (answerIndex: number) => void;
}

export function GrammarTestQuestion({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
}: GrammarTestQuestionProps) {
  const { colors } = useTheme();

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <View style={styles.container}>
      <View style={[styles.questionCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.questionNumber, { color: colors.primary }]}>
          Питання {questionNumber}
        </Text>
        <Text style={[styles.questionText, { color: colors.textPrimary }]}>
          {question.question}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => onSelectAnswer(index)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.optionLabel,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionLabelText,
                    {
                      color: isSelected ? "#FFFFFF" : colors.textPrimary,
                    },
                  ]}
                >
                  {optionLabels[index]}
                </Text>
              </View>

              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected
                      ? colors.textPrimary
                      : colors.textSecondary,
                  },
                ]}
              >
                {option}
              </Text>

              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SIZES.spacing.lg,
  },
  questionCard: {
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  questionNumber: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: "600",
    marginBottom: SIZES.spacing.sm,
  },
  questionText: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    lineHeight: 28,
  },
  optionsContainer: {
    gap: SIZES.spacing.md,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    gap: SIZES.spacing.md,
  },
  optionLabel: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabelText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "bold",
  },
  optionText: {
    flex: 1,
    fontSize: SIZES.fontSize.md,
    lineHeight: 22,
  },
});
