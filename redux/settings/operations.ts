import { showToast } from "@/hooks/showToast";
import { AppSettings, DEFAULT_SETTINGS } from "@/types/settings.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loadSettings = createAsyncThunk<
  AppSettings,
  void,
  { rejectValue: string }
>("settings/loadSettings", async (_, { rejectWithValue }) => {
  try {
    const savedSettings = await AsyncStorage.getItem("@app_settings");

    if (savedSettings) {
      return JSON.parse(savedSettings) as AppSettings;
    }

    return DEFAULT_SETTINGS;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to load settings:", error);
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Не вдалося завантажити налаштування");
  }
});

export const saveSettings = createAsyncThunk<
  AppSettings,
  AppSettings,
  { rejectValue: string }
>("settings/saveSettings", async (settings, { rejectWithValue }) => {
  try {
    await AsyncStorage.setItem("@app_settings", JSON.stringify(settings));

    showToast.success({
      message: "Налаштування збережено",
      duration: 2000,
    });

    return settings;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка збереження налаштувань",
      });
      return rejectWithValue(error.message);
    }

    showToast.error({ message: "Помилка збереження налаштувань" });
    return rejectWithValue("Помилка збереження налаштувань");
  }
});
