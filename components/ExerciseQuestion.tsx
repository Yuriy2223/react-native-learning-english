import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { Exercise } from "../types";
import { getExerciseTypeIcon, getExerciseTypeLabel } from "../utils";

interface ExerciseQuestionProps {
  exercise: Exercise;
}

export function ExerciseQuestion({ exercise }: ExerciseQuestionProps) {
  const { colors } = useTheme();

  return (
    <>
      <View style={[styles.exerciseType, { backgroundColor: colors.surface }]}>
        <Ionicons
          name={getExerciseTypeIcon(exercise.type) as any}
          size={20}
          color={colors.primary}
        />
        <Text style={[styles.exerciseTypeText, { color: colors.textPrimary }]}>
          {getExerciseTypeLabel(exercise.type)}
        </Text>
        <View
          style={[
            styles.pointsBadge,
            { backgroundColor: colors.warning + "20" },
          ]}
        >
          <Text style={[styles.pointsText, { color: colors.warning }]}>
            +{exercise.points}
          </Text>
        </View>
      </View>

      <View
        style={[styles.questionContainer, { backgroundColor: colors.surface }]}
      >
        <Text style={[styles.questionText, { color: colors.textPrimary }]}>
          {exercise.question}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  exerciseType: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.spacing.lg,
  },
  exerciseTypeText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
    marginLeft: SIZES.spacing.sm,
    flex: 1,
  },
  pointsBadge: {
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.sm,
  },
  pointsText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "600",
  },
  questionContainer: {
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
    marginBottom: SIZES.spacing.lg,
    minHeight: 100,
    justifyContent: "center",
  },
  questionText: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    lineHeight: 28,
    textAlign: "center",
  },
});
