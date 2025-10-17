import { UserProgress } from "@/types/user.types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface ProfileStatsProps {
  progress: UserProgress;
}

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: string | number;
  label: string;
}

function StatCard({ icon, iconColor, value, label }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color={iconColor} />
      <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

export function ProfileStats({ progress }: ProfileStatsProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Статистика навчання
      </Text>

      <View style={styles.statsGrid}>
        <StatCard
          icon="time"
          iconColor={colors.primary}
          value="Почнемо?"
          label="Час навчання"
        />

        <StatCard
          icon="library"
          iconColor={colors.success}
          value={progress.knownWords}
          label="Слова"
        />

        <StatCard
          icon="chatbubbles"
          iconColor={colors.secondary}
          value={progress.knownPhrases}
          label="Фрази"
        />

        <StatCard
          icon="trophy"
          iconColor={colors.warning}
          value={progress.totalPoints}
          label="Бали"
        />

        <StatCard
          icon="flame"
          iconColor={colors.error}
          value={progress.streak}
          label="Серія днів"
        />

        <StatCard
          icon="checkmark-circle"
          iconColor={colors.success}
          value={progress.completedTopics}
          label="Теми"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  title: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.lg,
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
    width: "30%",
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
