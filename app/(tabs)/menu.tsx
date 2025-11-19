import { selectUser } from "@/redux/user/selectors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SIZES } from "../../constants";
import { showToast } from "../../hooks/showToast";
import { useTheme } from "../../hooks/useTheme";
import { logoutUser } from "../../redux/auth/operations";
import { updateTheme } from "../../redux/settings/slice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { navigate } from "../../utils";

export default function MenuScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  // const { user } = useAppSelector((state) => state.auth);
  const user = useAppSelector(selectUser);

  const handleThemeToggle = async () => {
    try {
      await toggleTheme();
      const newTheme = !isDark ? "dark" : "light";
      dispatch(updateTheme(newTheme));
      showToast.success({
        message: `Тему змінено на ${newTheme === "dark" ? "темну" : "світлу"}`,
      });
    } catch (error) {
      console.error("Error toggling theme:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Вихід з акаунту", "Ви впевнені, що хочете вийти з акаунту?", [
      {
        text: "Скасувати",
        style: "cancel",
      },
      {
        text: "Вийти",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(logoutUser());
            showToast.success({
              message: "Ви успішно вийшли з акаунту",
            });
            router.replace("/(auth)/login");
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      id: "profile",
      title: "Профіль",
      icon: "person-outline",
      onPress: () => navigate("/(tabs)/profile"),
    },
    {
      id: "achievements",
      title: "Досягнення",
      icon: "trophy-outline",
      onPress: () => navigate("/achievements"),
    },
    {
      id: "settings",
      title: "Налаштування",
      icon: "settings-outline",
      onPress: () => navigate("/(tabs)/settings"),
    },
    {
      id: "support",
      title: "Підтримка",
      icon: "help-circle-outline",
      onPress: () => {
        showToast.success({
          message: "Розділ підтримки буде доступний незабаром",
        });
      },
    },
    {
      id: "about",
      title: "Про застосунок",
      icon: "information-circle-outline",
      onPress: () => {
        showToast.success({
          message: "English Learning App v1.0.0",
        });
      },
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Меню
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.profileSection, { backgroundColor: colors.surface }]}
        >
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.avatarText}>
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>
              {user?.name || "Користувач"}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email || "user@example.com"}
            </Text>
          </View>
        </View>

        <View
          style={[styles.themeSection, { backgroundColor: colors.surface }]}
        >
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={24}
            color={colors.textPrimary}
          />
          <Text style={[styles.themeText, { color: colors.textPrimary }]}>
            {isDark ? "Темна тема" : "Світла тема"}
          </Text>
          <Switch
            value={isDark}
            onValueChange={handleThemeToggle}
            trackColor={{
              false: colors.border,
              true: colors.primary + "80",
            }}
            thumbColor={isDark ? colors.primary : colors.surface}
            ios_backgroundColor={colors.border}
          />
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { backgroundColor: colors.surface }]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={colors.textPrimary}
              />
              <Text style={[styles.menuText, { color: colors.textPrimary }]}>
                {item.title}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: colors.error + "20" },
          ]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Вихід з акаунту
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.md,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SIZES.spacing.md,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.spacing.md,
  },
  avatarText: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: SIZES.fontSize.sm,
  },
  themeSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    marginBottom: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
  },
  themeText: {
    flex: 1,
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
    marginLeft: SIZES.spacing.md,
  },
  menuSection: {
    gap: SIZES.spacing.xs,
    marginBottom: SIZES.spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    gap: SIZES.spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.xl,
  },
  logoutText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
});
