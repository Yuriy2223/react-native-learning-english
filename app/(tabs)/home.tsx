import { Spinner } from "@/components/Spinner";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchUserProgress, refreshUserStats } from "@/redux/user/operations";
import {
  selectStreak,
  selectUser,
  selectUserIsLoading,
} from "@/redux/user/selectors";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/Button";
import { SIZES } from "../../constants";
import { useTheme } from "../../hooks/useTheme";
import { formatStudyTime } from "../../utils/formatTime";

export default function HomeScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectUserIsLoading);
  const streak = useAppSelector(selectStreak);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchUserProgress());
      dispatch(refreshUserStats());
    }, [dispatch])
  );

  const handleGetStarted = () => {
    router.push("/explore");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.avatarSection}>
        <View
          style={[styles.avatarContainer, { backgroundColor: colors.primary }]}
        >
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarText}>
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() ?? "?"}
            </Text>
          )}
        </View>

        <Text style={[styles.userName, { color: colors.textPrimary }]}>
          {user?.name}
        </Text>
      </View>

      <View style={[styles.sessionBlock, { backgroundColor: colors.surface }]}>
        <View style={styles.sessionHeader}>
          <Ionicons name="time-outline" size={24} color={colors.primary} />
          <Text style={[styles.sessionTitle, { color: colors.textPrimary }]}>
            Поточна сесія
          </Text>
        </View>

        <Text style={[styles.studyTime, { color: colors.primary }]}>
          {formatStudyTime(user?.totalStudySeconds || 0)}
        </Text>

        <Text style={[styles.studyLabel, { color: colors.textSecondary }]}>
          Загальний час навчання
        </Text>
      </View>

      <View style={[styles.streakBlock, { backgroundColor: colors.surface }]}>
        <View style={styles.streakRow}>
          <Ionicons name="flame" size={32} color={colors.error} />
          <Text style={[styles.streakNumber, { color: colors.textPrimary }]}>
            {streak}
          </Text>
          <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
            {streak === 1 ? "день поспіль" : "днів поспіль"}
          </Text>
        </View>
      </View>

      <View style={styles.buttonSection}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          size="large"
          style={styles.getStartedButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.xl,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: SIZES.spacing.xxl,
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.spacing.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  avatarText: {
    fontSize: SIZES.fontSize.xxl * 1.5,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "600",
    textAlign: "center",
  },
  sessionBlock: {
    width: "100%",
    padding: SIZES.spacing.xl,
    borderRadius: SIZES.borderRadius.lg,
    alignItems: "center",
    marginBottom: SIZES.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.spacing.lg,
  },
  sessionTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginLeft: SIZES.spacing.sm,
  },
  studyTime: {
    fontSize: SIZES.fontSize.xxl * 1.5,
    fontWeight: "bold",
    marginBottom: SIZES.spacing.xs,
  },
  studyLabel: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
  },
  streakBlock: {
    width: "100%",
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
    alignItems: "center",
    marginBottom: SIZES.spacing.xxl,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.spacing.sm,
  },
  streakNumber: {
    fontSize: SIZES.fontSize.xxl * 1.2,
    fontWeight: "bold",
    marginTop: SIZES.spacing.xs,
  },
  streakLabel: {
    fontSize: SIZES.fontSize.md,
    marginTop: SIZES.spacing.xs,
  },
  buttonSection: {
    width: "100%",
    alignItems: "center",
  },
  getStartedButton: {
    width: "100%",
    minHeight: 56,
  },
});
