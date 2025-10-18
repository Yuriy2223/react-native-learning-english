import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface ExerciseHeaderProps {
  totalScore: number;
}

export function ExerciseHeader({ totalScore }: ExerciseHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
        Вправи
      </Text>

      <View style={styles.scoreContainer}>
        <Ionicons name="trophy" size={20} color={colors.warning} />
        <Text style={[styles.scoreText, { color: colors.textPrimary }]}>
          {totalScore}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    textAlign: "center",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.spacing.xs,
  },
  scoreText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
});
