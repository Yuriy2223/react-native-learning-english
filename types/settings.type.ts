export interface AppSettings {
  language: "uk" | "en";
  theme: "light" | "dark";
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  offlineMode: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  language: "uk",
  theme: "light",
  soundEnabled: true,
  notificationsEnabled: true,
  offlineMode: false,
};
