// utils/index.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { COLORS, STORAGE_KEYS } from "../constants";
import { AppSettings } from "../types";

// Storage utilities
export const storage = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  },

  async getItem(key: string): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error getting from storage:", error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from storage:", error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};

// Auth utilities
export const authUtils = {
  async saveAuthToken(token: string): Promise<void> {
    await storage.setItem(STORAGE_KEYS.USER_TOKEN, token);
  },

  async getAuthToken(): Promise<string | null> {
    return await storage.getItem(STORAGE_KEYS.USER_TOKEN);
  },

  async removeAuthToken(): Promise<void> {
    await storage.removeItem(STORAGE_KEYS.USER_TOKEN);
  },

  async saveUserData(userData: any): Promise<void> {
    await storage.setItem(STORAGE_KEYS.USER_DATA, userData);
  },

  async getUserData(): Promise<any> {
    return await storage.getItem(STORAGE_KEYS.USER_DATA);
  },

  async removeUserData(): Promise<void> {
    await storage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};

// Settings utilities
export const settingsUtils = {
  async saveSettings(settings: AppSettings): Promise<void> {
    await storage.setItem(STORAGE_KEYS.APP_SETTINGS, settings);
  },

  async getSettings(): Promise<AppSettings | null> {
    return await storage.getItem(STORAGE_KEYS.APP_SETTINGS);
  },
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Format utilities
export const formatStudyTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} хв`;
  }

  return `${hours}г ${mins}хв`;
};

export const formatProgress = (completed: number, total: number): string => {
  if (total === 0) return "0%";
  const percentage = Math.round((completed / total) * 100);
  return `${percentage}%`;
};

// Date utilities
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString("uk-UA");
};

// Audio utilities
export const playAudio = async (audioUrl: string): Promise<void> => {
  try {
    // This will be implemented with Expo AV later
    console.log("Playing audio:", audioUrl);
  } catch (error) {
    console.error("Error playing audio:", error);
  }
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const capitalizeFirst = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Progress utilities
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min(Math.round((completed / total) * 100), 100);
};

// Theme utilities
export const getThemeColors = (isDark: boolean) => {
  return isDark ? COLORS.dark : COLORS.light;
};

// navigation.ts
// export const navigate = (path: string) => router.push(path as any);
export const navigate = (path: string, params?: Record<string, any>) => {
  if (params) {
    router.push({ pathname: path, params } as any);
  } else {
    router.push(path as any);
  }
};
export const replace = (path: string) => router.replace(path as any);
