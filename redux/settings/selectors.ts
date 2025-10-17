import { RootState } from "../store";

export const selectSettings = (state: RootState) => state.settings.settings;

export const selectLanguage = (state: RootState) =>
  state.settings.settings.language;

export const selectTheme = (state: RootState) => state.settings.settings.theme;

export const selectSoundEnabled = (state: RootState) =>
  state.settings.settings.soundEnabled;

export const selectNotificationsEnabled = (state: RootState) =>
  state.settings.settings.notificationsEnabled;

export const selectOfflineMode = (state: RootState) =>
  state.settings.settings.offlineMode;

export const selectSettingsIsLoading = (state: RootState) =>
  state.settings.isLoading;

export const selectSettingsError = (state: RootState) => state.settings.isError;
