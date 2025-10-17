import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface ProfileActionsProps {
  onChangePassword: () => void;
  onNavigateSettings: () => void;
  onDeleteAccount: () => void;
}

interface ActionItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  title: string;
  titleColor?: string;
  description: string;
  onPress: () => void;
}

function ActionItem({
  icon,
  iconColor,
  iconBgColor,
  title,
  titleColor,
  description,
  onPress,
}: ActionItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.actionItem, { backgroundColor: colors.background }]}
      onPress={onPress}
    >
      <View style={[styles.actionIcon, { backgroundColor: iconBgColor }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.actionContent}>
        <Text
          style={[
            styles.actionTitle,
            { color: titleColor || colors.textPrimary },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[styles.actionDescription, { color: colors.textSecondary }]}
        >
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

export function ProfileActions({
  onChangePassword,
  onNavigateSettings,
  onDeleteAccount,
}: ProfileActionsProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Налаштування акаунту
      </Text>

      <ActionItem
        icon="key"
        iconColor={colors.primary}
        iconBgColor={colors.primary + "20"}
        title="Змінити пароль"
        description="Оновіть свій пароль для безпеки"
        onPress={onChangePassword}
      />

      <ActionItem
        icon="settings"
        iconColor={colors.secondary}
        iconBgColor={colors.secondary + "20"}
        title="Налаштування"
        description="Мова, тема, сповіщення"
        onPress={onNavigateSettings}
      />

      <ActionItem
        icon="trash"
        iconColor={colors.error}
        iconBgColor={colors.error + "20"}
        title="Видалити акаунт"
        titleColor={colors.error}
        description="Безповоротно видалити ваш акаунт"
        onPress={onDeleteAccount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  title: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.md,
    textAlign: "center",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.spacing.sm,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
    marginBottom: SIZES.spacing.xs,
  },
  actionDescription: {
    fontSize: SIZES.fontSize.sm,
  },
});
