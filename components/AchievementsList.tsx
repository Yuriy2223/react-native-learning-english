import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { Achievement } from "../types";
import { AchievementCard } from "./AchievementCard";

interface AchievementsListProps {
  achievements: Achievement[];
  title: string;
  isLocked?: boolean;
}

export function AchievementsList({
  achievements,
  title,
  isLocked = false,
}: AchievementsListProps) {
  const { colors } = useTheme();

  if (achievements.length === 0) {
    return null;
  }

  return (
    <View style={styles.achievementsSection}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {title} ({achievements.length})
      </Text>

      <View style={styles.achievementsList}>
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            isLocked={isLocked}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  achievementsSection: {
    marginBottom: SIZES.spacing.lg,
  },
  sectionTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
  achievementsList: {
    paddingHorizontal: SIZES.spacing.lg,
    gap: SIZES.spacing.md,
  },
});
