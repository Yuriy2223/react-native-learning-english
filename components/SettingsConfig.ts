import { router } from "expo-router";
import { Alert } from "react-native";
import { showToast } from "../hooks/showToast";

export type SettingType = "navigation" | "switch";

export interface NavigationItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: "navigation";
  onPress: () => void;
}

export interface SwitchItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: "switch";
  value: boolean;
  onToggle: () => void | Promise<void>;
}

export type SettingItem = NavigationItem | SwitchItem;

export interface SettingGroup {
  title: string;
  items: SettingItem[];
}

interface GetSettingsGroupsParams {
  currentLanguage: string;
  isDark: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  offlineMode: boolean;
  userEmail?: string;
  onLanguagePress: () => void;
  onThemeToggle: () => void | Promise<void>;
  onSoundToggle: () => void | Promise<void>;
  onNotificationsToggle: () => void | Promise<void>;
  onOfflineModeToggle: () => void | Promise<void>;
}

export const getSettingsGroups = ({
  currentLanguage,
  isDark,
  soundEnabled,
  notificationsEnabled,
  offlineMode,
  userEmail,
  onLanguagePress,
  onThemeToggle,
  onSoundToggle,
  onNotificationsToggle,
  onOfflineModeToggle,
}: GetSettingsGroupsParams): SettingGroup[] => [
  {
    title: "Загальні",
    items: [
      {
        id: "language",
        title: "Мова інтерфейсу",
        subtitle: currentLanguage === "uk" ? "Українська" : "English",
        icon: "language",
        type: "navigation",
        onPress: onLanguagePress,
      },
      {
        id: "theme",
        title: isDark ? "Темна тема" : "Світла тема",
        subtitle: "Перемикання між темною та світлою темою",
        icon: isDark ? "moon" : "sunny",
        type: "switch",
        value: isDark,
        onToggle: onThemeToggle,
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
        value: soundEnabled,
        onToggle: onSoundToggle,
      },
      {
        id: "notifications",
        title: "Push-сповіщення",
        subtitle: "Нагадування про навчання",
        icon: "notifications",
        type: "switch",
        value: notificationsEnabled,
        onToggle: onNotificationsToggle,
      },
      {
        id: "offline",
        title: "Офлайн режим",
        subtitle: "Завантаження контенту для офлайн",
        icon: "cloud-offline",
        type: "switch",
        value: offlineMode,
        onToggle: onOfflineModeToggle,
      },
    ],
  },
  {
    title: "Акаунт",
    items: [
      {
        id: "profile",
        title: "Профіль користувача",
        subtitle: userEmail || "Налаштування профілю",
        icon: "person",
        type: "navigation",
        onPress: () => router.push("/profile"),
      },
      {
        id: "privacy",
        title: "Конфіденційність",
        subtitle: "Політика конфіденційності",
        icon: "shield-checkmark",
        type: "navigation",
        onPress: () => {
          showToast.info({
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
          showToast.info({
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
          showToast.info({
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
