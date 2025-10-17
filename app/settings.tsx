import { LanguageSelectionModal } from "@/components/LanguageSelectionModal";
import { ResetSettingsModal } from "@/components/ResetSettingsModal";
import { getSettingsGroups, SettingItem } from "@/components/SettingsConfig";
import { DEFAULT_SETTINGS } from "@/types/settings.type";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../components/Button";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "../hooks/useTranslation";
import { saveSettings } from "../redux/settings/operations";
import {
  resetSettings,
  toggleNotifications,
  toggleOfflineMode,
  toggleSound,
} from "../redux/settings/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export default function SettingsScreen() {
  const [showResetModal, setShowResetModal] = useState(false);
  const { colors, isDark, toggleTheme } = useTheme();
  const { changeLanguage, currentLanguage } = useTranslation();
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings.settings);
  const isLoading = useAppSelector((state) => state.settings.isLoading);
  const user = useAppSelector((state) => state.auth.user);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleThemeToggle = async () => {
    try {
      await toggleTheme();
    } catch (error) {
      console.error("Помилка зміни теми:", error);
    }
  };

  const handleLanguageChange = async (language: "uk" | "en") => {
    try {
      await changeLanguage(language);
      setShowLanguageModal(false);
      await dispatch(saveSettings({ ...settings, language }));
    } catch (error) {
      console.error("Помилка зміни мови:", error);
    }
  };

  const handleSoundToggle = async () => {
    try {
      const newValue = !settings.soundEnabled;
      dispatch(toggleSound());
      await dispatch(saveSettings({ ...settings, soundEnabled: newValue }));
    } catch (error) {
      console.error("Помилка зміни налаштувань звуку:", error);
    }
  };

  const handleNotificationsToggle = async () => {
    try {
      const newValue = !settings.notificationsEnabled;
      dispatch(toggleNotifications());
      await dispatch(
        saveSettings({ ...settings, notificationsEnabled: newValue })
      );
    } catch (error) {
      console.error("Помилка зміни налаштувань сповіщень:", error);
    }
  };

  const handleOfflineModeToggle = async () => {
    try {
      const newValue = !settings.offlineMode;
      dispatch(toggleOfflineMode());
      await dispatch(saveSettings({ ...settings, offlineMode: newValue }));
    } catch (error) {
      console.error("Помилка зміни офлайн режиму:", error);
    }
  };

  const handleResetSettings = () => {
    setShowResetModal(true);
  };

  const confirmResetSettings = async () => {
    try {
      dispatch(resetSettings());
      await dispatch(saveSettings(DEFAULT_SETTINGS));
      setShowResetModal(false);
    } catch (error) {
      console.error("Помилка скидання налаштувань:", error);
    }
  };

  const settingsGroups = getSettingsGroups({
    currentLanguage,
    isDark,
    soundEnabled: settings.soundEnabled,
    notificationsEnabled: settings.notificationsEnabled,
    offlineMode: settings.offlineMode,
    userEmail: user?.email,
    onLanguagePress: () => setShowLanguageModal(true),
    onThemeToggle: handleThemeToggle,
    onSoundToggle: handleSoundToggle,
    onNotificationsToggle: handleNotificationsToggle,
    onOfflineModeToggle: handleOfflineModeToggle,
  });

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.settingItem, { backgroundColor: colors.surface }]}
      onPress={item.type === "navigation" ? item.onPress : undefined}
      disabled={item.type === "switch"}
      activeOpacity={item.type === "navigation" ? 0.7 : 1}
    >
      <View
        style={[styles.settingIcon, { backgroundColor: colors.primary + "20" }]}
      >
        <Ionicons name={item.icon as any} size={20} color={colors.primary} />
      </View>

      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
          {item.title}
        </Text>
        <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
          {item.subtitle}
        </Text>
      </View>

      {item.type === "switch" && (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{
            false: colors.border,
            true: colors.primary + "80",
          }}
          thumbColor={item.value ? colors.primary : colors.surface}
          ios_backgroundColor={colors.border}
        />
      )}

      {item.type === "navigation" && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Налаштування
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingGroup}>
            <Text style={[styles.groupTitle, { color: colors.textPrimary }]}>
              {group.title}
            </Text>

            <View style={styles.groupItems}>
              {group.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        <View style={styles.resetContainer}>
          <Button
            title="Скинути налаштування"
            onPress={handleResetSettings}
            variant="outline"
            style={[styles.resetButton, { borderColor: colors.error }]}
            textStyle={{ color: colors.error }}
            loading={isLoading}
          />
        </View>
      </ScrollView>

      <LanguageSelectionModal
        visible={showLanguageModal}
        colors={colors}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleLanguageChange}
        onClose={() => setShowLanguageModal(false)}
      />
      <ResetSettingsModal
        visible={showResetModal}
        colors={colors}
        isLoading={isLoading}
        onConfirm={confirmResetSettings}
        onCancel={() => setShowResetModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.xxl,
    paddingBottom: SIZES.spacing.md,
  },
  backButton: {
    padding: SIZES.spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  settingGroup: {
    marginBottom: SIZES.spacing.lg,
  },
  groupTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.sm,
  },
  groupItems: {
    marginHorizontal: SIZES.spacing.lg,
    gap: SIZES.spacing.xs,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
    marginBottom: SIZES.spacing.xs,
  },
  settingSubtitle: {
    fontSize: SIZES.fontSize.sm,
  },
  resetContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    marginTop: SIZES.spacing.lg,
  },
  resetButton: {
    width: "100%",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.spacing.lg,
  },
  modalTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: SIZES.spacing.lg,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.spacing.sm,
  },
  languageText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
  },
  modalCloseButton: {
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    alignItems: "center",
    marginTop: SIZES.spacing.md,
  },
  modalCloseText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
  },
});
