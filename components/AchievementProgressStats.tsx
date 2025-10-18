import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface ProgressStatsProps {
  knownWords: number;
  knownPhrases: number;
  unlockedAchievementsCount: number;
  streak: number;
}

export function AchievementProgressStats({
  knownWords,
  knownPhrases,
  unlockedAchievementsCount,
  streak,
}: ProgressStatsProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.overviewContainer, { backgroundColor: colors.surface }]}
    >
      <Text style={[styles.overviewTitle, { color: colors.textPrimary }]}>
        Загальний прогрес
      </Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="library" size={24} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {knownWords}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Слова
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="chatbubbles" size={24} color={colors.secondary} />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {knownPhrases}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Фрази
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color={colors.warning} />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {unlockedAchievementsCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Досягнення
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color={colors.error} />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {streak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Дні поспіль
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overviewContainer: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  overviewTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.md,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: SIZES.spacing.md,
  },
  statCard: {
    alignItems: "center",
    width: "22%",
  },
  statNumber: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "bold",
    marginTop: SIZES.spacing.xs,
    marginBottom: SIZES.spacing.xs,
  },
  statLabel: {
    fontSize: SIZES.fontSize.xs,
    textAlign: "center",
  },
});
