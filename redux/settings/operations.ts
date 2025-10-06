import { createAsyncThunk } from "@reduxjs/toolkit";
import { DEFAULT_SETTINGS } from "../../constants";
import { AppSettings } from "../../types";
import { settingsUtils } from "../../utils";

export const loadSettings = createAsyncThunk(
  "settings/loadSettings",
  async (_, { rejectWithValue }) => {
    try {
      const savedSettings = await settingsUtils.getSettings();
      return savedSettings || DEFAULT_SETTINGS;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load settings");
    }
  }
);

export const saveSettings = createAsyncThunk(
  "settings/saveSettings",
  async (settings: AppSettings, { rejectWithValue }) => {
    try {
      await settingsUtils.saveSettings(settings);
      return settings;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to save settings");
    }
  }
);
