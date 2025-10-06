// components/DrawerContent.tsx
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { router } from "expo-router";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";
import { logoutUser } from "../redux/auth/operations";
import { updateTheme } from "../redux/settings/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { navigate } from "@/utils";

export function DrawerContent(props: any) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { showSuccess } = useToast();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleThemeToggle = async () => {
    try {
      await toggleTheme();
      const newTheme = !isDark ? "dark" : "light";
      dispatch(updateTheme(newTheme));
      showSuccess({
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
            showSuccess({
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
      onPress: () => {
        props.navigation.closeDrawer();
        // router.push("/profile");
        navigate("/profile");
      },
    },
    {
      id: "achievements",
      title: "Досягнення",
      icon: "trophy-outline",
      onPress: () => {
        props.navigation.closeDrawer();
        // router.push("/achievements");
        navigate("/achievements");
      },
    },
    {
      id: "settings",
      title: "Налаштування",
      icon: "settings-outline",
      onPress: () => {
        props.navigation.closeDrawer();
        // router.push("/settings");
        navigate("/settings");
      },
    },
    {
      id: "support",
      title: "Підтримка",
      icon: "help-circle-outline",
      onPress: () => {
        props.navigation.closeDrawer();
        showSuccess({
          message: "Розділ підтримки буде доступний незабаром",
        });
      },
    },
    {
      id: "about",
      title: "Про застосунок",
      icon: "information-circle-outline",
      onPress: () => {
        props.navigation.closeDrawer();
        showSuccess({
          message: "English Learning App v1.0.0",
        });
      },
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
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
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || "Користувач"}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email || "user@example.com"}
            </Text>
          </View>
        </View>

        {/* Theme Toggle */}
        <View
          style={[styles.themeSection, { backgroundColor: colors.surface }]}
        >
          <View style={styles.themeRow}>
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={24}
              color={colors.text}
            />
            <Text style={[styles.themeText, { color: colors.text }]}>
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
        </View>

        {/* Menu Items */}
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
                color={colors.text}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuText, { color: colors.text }]}>
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
      </DrawerContentScrollView>

      {/* Logout Button */}
      <View style={[styles.logoutSection, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: colors.error + "20" },
          ]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color={colors.error}
            style={styles.logoutIcon}
          />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Вихід з акаунту
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.lg,
    marginHorizontal: SIZES.spacing.md,
    marginTop: SIZES.spacing.md,
    marginBottom: SIZES.spacing.lg,
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
    marginBottom: SIZES.spacing.xs,
  },
  userEmail: {
    fontSize: SIZES.fontSize.sm,
  },
  themeSection: {
    marginHorizontal: SIZES.spacing.md,
    marginBottom: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.md,
    padding: SIZES.spacing.md,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeText: {
    flex: 1,
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
    marginLeft: SIZES.spacing.md,
  },
  menuSection: {
    marginHorizontal: SIZES.spacing.md,
    gap: SIZES.spacing.xs,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.spacing.xs,
  },
  menuIcon: {
    marginRight: SIZES.spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
  },
  logoutSection: {
    padding: SIZES.spacing.md,
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
  },
  logoutIcon: {
    marginRight: SIZES.spacing.md,
  },
  logoutText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
});
