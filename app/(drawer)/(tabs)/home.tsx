// app/(tabs)/home.tsx
import { selectUser } from "@/redux/auth/selectors";
import { useAppSelector } from "@/redux/store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "../../../components/Button";
import { SIZES } from "../../../constants";
import { useTheme } from "../../../hooks/useTheme";
import { formatStudyTime } from "../../../utils";

export default function HomeScreen() {
  const { colors } = useTheme();
  const user = useAppSelector(selectUser);

  const handleGetStarted = () => {
    router.push("/explore");
  };

  if (!user) {
    return (
      <View
        style={[
          styles.container,
          styles.loading,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Завантаження...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View
          style={[styles.avatarContainer, { backgroundColor: colors.primary }]}
        >
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarText}>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Text>
          )}
        </View>

        {/* User Name */}
        <Text style={[styles.userName, { color: colors.text }]}>
          {user.name}
        </Text>
      </View>

      {/* Study Session Block */}
      <View style={[styles.sessionBlock, { backgroundColor: colors.surface }]}>
        <View style={styles.sessionHeader}>
          <Ionicons name="time-outline" size={24} color={colors.primary} />
          <Text style={[styles.sessionTitle, { color: colors.text }]}>
            Поточна сесія
          </Text>
        </View>

        <Text style={[styles.studyTime, { color: colors.primary }]}>
          {formatStudyTime(user.totalStudyHours * 60)}
        </Text>

        <Text style={[styles.studyLabel, { color: colors.textSecondary }]}>
          загальний час навчання
        </Text>
      </View>

      {/* Get Started Button */}
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
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: SIZES.fontSize.lg,
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
  buttonSection: {
    width: "100%",
    alignItems: "center",
  },
  getStartedButton: {
    width: "100%",
    minHeight: 56,
  },
});
