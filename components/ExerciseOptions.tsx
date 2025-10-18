import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface ExerciseOptionsProps {
  options: string[];
  selectedAnswer: string | null;
  correctAnswer: string;
  showResult: boolean;
  onSelectAnswer: (answer: string) => void;
}

export function ExerciseOptions({
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  onSelectAnswer,
}: ExerciseOptionsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.optionsContainer}>
      {options.map((option, index) => {
        const isSelected = selectedAnswer === option;
        const isCorrectOption = option === correctAnswer;
        const showCorrectAnswer = showResult && isCorrectOption;
        const showWrongAnswer = showResult && isSelected && !isCorrectOption;

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              isSelected &&
                !showResult && {
                  borderColor: colors.primary,
                  backgroundColor: colors.primary + "10",
                },
              showCorrectAnswer && {
                borderColor: colors.success,
                backgroundColor: colors.success + "20",
              },
              showWrongAnswer && {
                borderColor: colors.error,
                backgroundColor: colors.error + "20",
              },
            ]}
            onPress={() => onSelectAnswer(option)}
            disabled={showResult}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View
                style={[
                  styles.optionIndicator,
                  { borderColor: colors.border },
                  isSelected &&
                    !showResult && {
                      borderColor: colors.primary,
                      backgroundColor: colors.primary,
                    },
                  showCorrectAnswer && {
                    borderColor: colors.success,
                    backgroundColor: colors.success,
                  },
                  showWrongAnswer && {
                    borderColor: colors.error,
                    backgroundColor: colors.error,
                  },
                ]}
              >
                {(isSelected && !showResult) ||
                showCorrectAnswer ||
                showWrongAnswer ? (
                  <Ionicons
                    name={
                      showCorrectAnswer
                        ? "checkmark"
                        : showWrongAnswer
                        ? "close"
                        : "checkmark"
                    }
                    size={16}
                    color="#FFFFFF"
                  />
                ) : null}
              </View>

              <Text
                style={[
                  styles.optionText,
                  { color: colors.textPrimary },
                  isSelected && !showResult && { color: colors.primary },
                  showCorrectAnswer && { color: colors.success },
                  showWrongAnswer && { color: colors.error },
                ]}
              >
                {option}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.lg,
  },
  optionButton: {
    borderWidth: 2,
    borderRadius: SIZES.borderRadius.md,
    padding: SIZES.spacing.md,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.spacing.md,
  },
  optionText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
    flex: 1,
  },
});
