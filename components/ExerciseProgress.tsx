import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface ExerciseProgressProps {
  currentIndex: number;
  totalExercises: number;
}

export function ExerciseProgress({
  currentIndex,
  totalExercises,
}: ExerciseProgressProps) {
  const { colors } = useTheme();
  const progressPercentage = ((currentIndex + 1) / totalExercises) * 100;

  return (
    <View style={styles.progressSection}>
      <View style={styles.progressInfo}>
        <Text style={[styles.progressText, { color: colors.textPrimary }]}>
          Вправа {currentIndex + 1} з {totalExercises}
        </Text>
        <Text style={[styles.progressPercent, { color: colors.primary }]}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>

      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${progressPercentage}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressSection: {
    paddingHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.spacing.sm,
  },
  progressText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
  },
  progressPercent: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
});
