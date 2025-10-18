import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { Achievement } from "../types";
import {
  calculateProgressFromNumbers,
  getAchievementTypeColor,
  getAchievementTypeIcon,
} from "../utils";

interface AchievementCardProps {
  achievement: Achievement;
  isLocked?: boolean;
}

export function AchievementCard({
  achievement,
  isLocked = false,
}: AchievementCardProps) {
  const { colors } = useTheme();

  if (isLocked) {
    return (
      <View
        style={[
          styles.achievementCard,
          styles.lockedCard,
          { backgroundColor: colors.surface, opacity: 0.7 },
        ]}
      >
        <View
          style={[styles.achievementIcon, { backgroundColor: colors.border }]}
        >
          <Ionicons name="lock-closed" size={24} color={colors.textSecondary} />
        </View>

        <View style={styles.achievementContent}>
          <Text
            style={[styles.achievementTitle, { color: colors.textSecondary }]}
          >
            {achievement.title}
          </Text>

          <Text
            style={[
              styles.achievementDescription,
              { color: colors.textSecondary },
            ]}
          >
            {achievement.description}
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text
                style={[styles.progressText, { color: colors.textSecondary }]}
              >
                Прогрес: {achievement.progress}/{achievement.maxProgress}
              </Text>
              <Text
                style={[
                  styles.progressPercent,
                  { color: colors.textSecondary },
                ]}
              >
                {calculateProgressFromNumbers(
                  achievement.progress,
                  achievement.maxProgress
                )}
                %
              </Text>
            </View>

            <View
              style={[styles.progressBar, { backgroundColor: colors.border }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: getAchievementTypeColor(
                      achievement.type,
                      colors
                    ),
                    width: `${calculateProgressFromNumbers(
                      achievement.progress,
                      achievement.maxProgress
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.achievementCard,
        styles.unlockedCard,
        { backgroundColor: colors.surface },
      ]}
    >
      <View
        style={[
          styles.achievementIcon,
          {
            backgroundColor:
              getAchievementTypeColor(achievement.type, colors) + "20",
          },
        ]}
      >
        <Ionicons
          name={getAchievementTypeIcon(achievement.type) as any}
          size={24}
          color={getAchievementTypeColor(achievement.type, colors)}
        />
      </View>

      <View style={styles.achievementContent}>
        <View style={styles.achievementHeader}>
          <Text
            style={[styles.achievementTitle, { color: colors.textPrimary }]}
          >
            {achievement.title}
          </Text>
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor: getAchievementTypeColor(
                  achievement.type,
                  colors
                ),
              },
            ]}
          >
            <Text style={styles.typeText}>
              {achievement.type.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.achievementDescription,
            { color: colors.textSecondary },
          ]}
        >
          {achievement.description}
        </Text>

        {achievement.unlockedAt && (
          <Text style={[styles.unlockedDate, { color: colors.success }]}>
            Отримано:{" "}
            {new Date(achievement.unlockedAt).toLocaleDateString("uk-UA")}
          </Text>
        )}
      </View>

      <Ionicons name="checkmark-circle" size={24} color={colors.success} />
    </View>
  );
}

const styles = StyleSheet.create({
  achievementCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.lg,
  },
  unlockedCard: {
    borderWidth: 2,
    borderColor: "transparent",
  },
  lockedCard: {
    borderWidth: 1,
    borderStyle: "dashed",
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.spacing.md,
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SIZES.spacing.xs,
  },
  achievementTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: SIZES.spacing.xs,
    paddingVertical: 2,
    borderRadius: SIZES.borderRadius.sm,
  },
  typeText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  achievementDescription: {
    fontSize: SIZES.fontSize.sm,
    lineHeight: 18,
    marginBottom: SIZES.spacing.xs,
  },
  unlockedDate: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "500",
  },
  progressContainer: {
    marginTop: SIZES.spacing.sm,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.spacing.xs,
  },
  progressText: {
    fontSize: SIZES.fontSize.xs,
  },
  progressPercent: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "600",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
