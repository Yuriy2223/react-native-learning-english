import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_SETTINGS } from "../../constants";
import { AppSettings } from "../../types";
import { loadSettings, saveSettings } from "./operations";

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  isError: string | null;
}

const initialState: SettingsState = {
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  isError: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateLanguage: (state, action: PayloadAction<"uk" | "en">) => {
      state.settings.language = action.payload;
    },

    updateTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.settings.theme = action.payload;
    },

    toggleSound: (state) => {
      state.settings.soundEnabled = !state.settings.soundEnabled;
    },

    toggleNotifications: (state) => {
      state.settings.notificationsEnabled =
        !state.settings.notificationsEnabled;
    },

    toggleOfflineMode: (state) => {
      state.settings.offlineMode = !state.settings.offlineMode;
    },

    updateSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    resetSettings: (state) => {
      state.settings = DEFAULT_SETTINGS;
    },

    clearError: (state) => {
      state.isError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSettings.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload;
        state.isError = null;
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload as string;
      });

    builder
      .addCase(saveSettings.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload;
        state.isError = null;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload as string;
      });
  },
});

export const {
  updateLanguage,
  updateTheme,
  toggleSound,
  toggleNotifications,
  toggleOfflineMode,
  updateSettings,
  resetSettings,
  clearError,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
