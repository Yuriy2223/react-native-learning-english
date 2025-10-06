// app/settings.tsx
import { navigate } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
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
import { useToast } from "../hooks/useToast";
import { useTranslation } from "../hooks/useTranslation";
import { saveSettings } from "../redux/settings/operations";
import {
  resetSettings,
  toggleNotifications,
  toggleOfflineMode,
  toggleSound,
  updateTheme,
} from "../redux/settings/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { t, changeLanguage, currentLanguage } = useTranslation();
  const { showSuccess, showError } = useToast();
  const dispatch = useAppDispatch();

  const { settings, isLoading } = useAppSelector((state) => state.settings);
  const { user } = useAppSelector((state) => state.auth);

  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleThemeToggle = async () => {
    try {
      await toggleTheme();
      const newTheme = !isDark ? "dark" : "light";
      dispatch(updateTheme(newTheme));

      // const updatedSettings = { ...settings, theme: newTheme };
      const updatedSettings = {
        ...settings,
        theme: newTheme as "light" | "dark",
      };
      await dispatch(saveSettings(updatedSettings));

      showSuccess({
        message: t("drawer.themeChanged", {
          theme:
            newTheme === "dark"
              ? t("drawer.darkTheme")
              : t("drawer.lightTheme"),
        }),
      });
    } catch (error) {
      console.error("Помилка зміни теми:", error);
      showError({
        message: "Помилка зміни теми",
      });
    }
  };

  const handleLanguageChange = async (language: "uk" | "en") => {
    try {
      await changeLanguage(language);
      setShowLanguageModal(false);
      showSuccess({
        message: `Мову змінено на ${
          language === "uk" ? "українську" : "English"
        }`,
      });
    } catch (error) {
      console.error("Помилка зміни мови:", error);
      showError({
        message: "Помилка зміни мови",
      });
    }
  };

  const handleSoundToggle = async () => {
    try {
      dispatch(toggleSound());
      const updatedSettings = {
        ...settings,
        soundEnabled: !settings.soundEnabled,
      };
      await dispatch(saveSettings(updatedSettings));

      showSuccess({
        message: `Звук ${!settings.soundEnabled ? "увімкнено" : "вимкнено"}`,
      });
    } catch (error) {
      console.error("Помилка зміни налаштувань звуку:", error);
      showError({
        message: "Помилка зміни налаштувань звуку",
      });
    }
  };

  const handleNotificationsToggle = async () => {
    try {
      dispatch(toggleNotifications());
      const updatedSettings = {
        ...settings,
        notificationsEnabled: !settings.notificationsEnabled,
      };
      await dispatch(saveSettings(updatedSettings));

      showSuccess({
        message: `Сповіщення ${
          !settings.notificationsEnabled ? "увімкнено" : "вимкнено"
        }`,
      });
    } catch (error) {
      console.error("Помилка зміни налаштувань сповіщень:", error);
      showError({
        message: "Помилка зміни налаштувань сповіщень",
      });
    }
  };

  const handleOfflineModeToggle = async () => {
    try {
      dispatch(toggleOfflineMode());
      const updatedSettings = {
        ...settings,
        offlineMode: !settings.offlineMode,
      };
      await dispatch(saveSettings(updatedSettings));

      showSuccess({
        message: `Офлайн режим ${
          !settings.offlineMode ? "увімкнено" : "вимкнено"
        }`,
      });
    } catch (error) {
      console.error("Помилка зміни офлайн режиму:", error);
      showError({
        message: "Помилка зміни офлайн режиму",
      });
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      "Скинути налаштування",
      "Ви впевнені, що хочете скинути всі налаштування до стандартних?",
      [
        {
          text: "Скасувати",
          style: "cancel",
        },
        {
          text: "Скинути",
          style: "destructive",
          onPress: async () => {
            try {
              dispatch(resetSettings());
              await dispatch(
                saveSettings({
                  language: "uk",
                  theme: "light",
                  soundEnabled: true,
                  notificationsEnabled: true,
                  offlineMode: false,
                })
              );

              showSuccess({
                message: "Налаштування скинуто до стандартних",
              });
            } catch (error) {
              console.error("Помилка скидання налаштувань:", error);
              showError({
                message: "Помилка скидання налаштувань",
              });
            }
          },
        },
      ]
    );
  };

  const settingsGroups = [
    {
      title: "Загальні",
      items: [
        {
          id: "language",
          title: "Мова інтерфейсу",
          subtitle: currentLanguage === "uk" ? "Українська" : "English",
          icon: "language",
          type: "navigation",
          onPress: () => setShowLanguageModal(true),
        },
        {
          id: "theme",
          title: isDark ? "Темна тема" : "Світла тема",
          subtitle: "Автоматична зміна за системою",
          icon: isDark ? "moon" : "sunny",
          type: "switch",
          value: isDark,
          onToggle: handleThemeToggle,
        },
      ],
    },
    {
      title: "Навчання",
      items: [
        {
          id: "sound",
          title: "Звукові ефекти",
          subtitle: "Озвучення слів та інтерфейсу",
          icon: "volume-high",
          type: "switch",
          value: settings.soundEnabled,
          onToggle: handleSoundToggle,
        },
        {
          id: "notifications",
          title: "Push-сповіщення",
          subtitle: "Нагадування про навчання",
          icon: "notifications",
          type: "switch",
          value: settings.notificationsEnabled,
          onToggle: handleNotificationsToggle,
        },
        {
          id: "offline",
          title: "Офлайн режим",
          subtitle: "Завантаження контенту для офлайн",
          icon: "cloud-offline",
          type: "switch",
          value: settings.offlineMode,
          onToggle: handleOfflineModeToggle,
        },
      ],
    },
    {
      title: "Акаунт",
      items: [
        {
          id: "profile",
          title: "Профіль користувача",
          subtitle: user?.email || "Налаштування профілю",
          icon: "person",
          type: "navigation",
          // onPress: () => router.push("/profile"),
          onPress: () => navigate("/settings"),
        },
        {
          id: "privacy",
          title: "Конфіденційність",
          subtitle: "Політика конфіденційності",
          icon: "shield-checkmark",
          type: "navigation",
          onPress: () => {
            showSuccess({
              message: "Розділ буде доступний незабаром",
            });
          },
        },
      ],
    },
    {
      title: "Підтримка",
      items: [
        {
          id: "help",
          title: "Допомога",
          subtitle: "FAQ та підтримка",
          icon: "help-circle",
          type: "navigation",
          onPress: () => {
            showSuccess({
              message: "Розділ допомоги буде доступний незабаром",
            });
          },
        },
        {
          id: "feedback",
          title: "Зворотний зв'язок",
          subtitle: "Залишити відгук про застосунок",
          icon: "chatbubble-ellipses",
          type: "navigation",
          onPress: () => {
            showSuccess({
              message: "Форма зворотного зв'язку буде додана пізніше",
            });
          },
        },
        {
          id: "about",
          title: "Про застосунок",
          subtitle: "Версія 1.0.0",
          icon: "information-circle",
          type: "navigation",
          onPress: () => {
            Alert.alert(
              "English Learning App",
              "Версія: 1.0.0\nРозроблено для вивчення англійської мови\n\n© 2024 English Learning App",
              [{ text: "OK" }]
            );
          },
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.settingItem, { backgroundColor: colors.surface }]}
      onPress={item.onPress}
      disabled={item.type === "switch"}
      activeOpacity={item.type === "navigation" ? 0.7 : 1}
    >
      <View
        style={[styles.settingIcon, { backgroundColor: colors.primary + "20" }]}
      >
        <Ionicons name={item.icon} size={20} color={colors.primary} />
      </View>

      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Налаштування
        </Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingGroup}>
            <Text style={[styles.groupTitle, { color: colors.text }]}>
              {group.title}
            </Text>

            <View style={styles.groupItems}>
              {group.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* Reset Button */}
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

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Оберіть мову
            </Text>

            <TouchableOpacity
              style={[
                styles.languageOption,
                currentLanguage === "uk" && {
                  backgroundColor: colors.primary + "20",
                },
              ]}
              onPress={() => handleLanguageChange("uk")}
            >
              <Text style={[styles.languageText, { color: colors.text }]}>
                🇺🇦 Українська
              </Text>
              {currentLanguage === "uk" && (
                <Ionicons name="checkmark" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                currentLanguage === "en" && {
                  backgroundColor: colors.primary + "20",
                },
              ]}
              onPress={() => handleLanguageChange("en")}
            >
              <Text style={[styles.languageText, { color: colors.text }]}>
                🇺🇸 English
              </Text>
              {currentLanguage === "en" && (
                <Ionicons name="checkmark" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                { backgroundColor: colors.border },
              ]}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={[styles.modalCloseText, { color: colors.text }]}>
                Скасувати
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    paddingTop: SIZES.spacing.lg,
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
