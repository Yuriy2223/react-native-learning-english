import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface ExerciseResultProps {
  isCorrect: boolean;
  correctAnswer: string;
  points: number;
}

export function ExerciseResult({
  isCorrect,
  correctAnswer,
  points,
}: ExerciseResultProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.resultContainer,
        {
          backgroundColor: isCorrect
            ? colors.success + "10"
            : colors.error + "10",
        },
      ]}
    >
      <View style={styles.resultHeader}>
        <Ionicons
          name={isCorrect ? "checkmark-circle" : "close-circle"}
          size={24}
          color={isCorrect ? colors.success : colors.error}
        />
        <Text
          style={[
            styles.resultTitle,
            { color: isCorrect ? colors.success : colors.error },
          ]}
        >
          {isCorrect ? "Правильно!" : "Неправильно"}
        </Text>
      </View>

      {!isCorrect && (
        <Text
          style={[styles.resultExplanation, { color: colors.textSecondary }]}
        >
          Правильна відповідь: {correctAnswer}
        </Text>
      )}

      <Text style={[styles.resultScore, { color: colors.textPrimary }]}>
        {isCorrect ? `+${points} балів` : "0 балів"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  resultContainer: {
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
    marginBottom: SIZES.spacing.lg,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.spacing.sm,
  },
  resultTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginLeft: SIZES.spacing.sm,
  },
  resultExplanation: {
    fontSize: SIZES.fontSize.md,
    marginBottom: SIZES.spacing.sm,
  },
  resultScore: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
});
