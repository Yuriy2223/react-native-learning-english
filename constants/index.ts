import { Platform } from "react-native";

export const COLORS = {
  light: {
    primary: "#007AFF",
    secondary: "#5856D6",
    background: "#FFFFFF",
    surface: "#F2F2F7",
    text: "#000000",
    textSecondary: "#6D6D80",
    border: "#C6C6C8",
    success: "#34C759",
    warning: "#FF9500",
    error: "#FF3B30",
  },
  dark: {
    primary: "#0A84FF",
    secondary: "#5E5CE6",
    background: "#000000",
    surface: "#1C1C1E",
    text: "#FFFFFF",
    textSecondary: "#8E8E93",
    border: "#38383A",
    success: "#30D158",
    warning: "#FF9F0A",
    error: "#FF453A",
  },
};

export const SHADOWS = {
  small: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
    web: {
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    android: {
      elevation: 3,
    },
    web: {
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
    web: {
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    },
  }),
};

export const SIZES = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
};

export const STORAGE_KEYS = {
  USER_TOKEN: "@auth_token",
  USER_DATA: "@user_data",
  APP_SETTINGS: "@app_settings",
  OFFLINE_DATA: "@offline_data",
};

export const API_ENDPOINTS = {
  BASE_URL: "https://api.example.com",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",
  USER_PROFILE: "/user/profile",
  TOPICS: "/topics",
  WORDS: "/words",
  PHRASES: "/phrases",
  GRAMMAR: "/grammar",
  EXERCISES: "/exercises",
  PROGRESS: "/user/progress",
};

export const NAVIGATION_ROUTES = {
  // Auth Stack
  LOGIN: "Login" as const,
  REGISTER: "Register" as const,
  FORGOT_PASSWORD: "ForgotPassword" as const,

  // Main App
  HOME: "Home" as const,
  EXPLORE: "Explore" as const,
  PHRASES: "Phrases" as const,
  GRAMMAR: "Grammar" as const,

  // Modules
  VOCABULARY_TOPIC: "VocabularyTopic" as const,
  WORD_CARD: "WordCard" as const,
  PHRASES_TOPIC: "PhrasesTopi" as const,
  PHRASE_CARD: "PhraseCard" as const,
  GRAMMAR_TOPIC: "GrammarTopic" as const,
  EXERCISES: "Exercises" as const,
  ACHIEVEMENTS: "Achievements" as const,
  SETTINGS: "Settings" as const,
  PROFILE: "Profile" as const,
};

export const EXERCISE_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice" as const,
  DRAG_DROP: "drag_drop" as const,
  AUDIO: "audio" as const,
  FILL_BLANK: "fill_blank" as const,
};

export const DIFFICULTY_LEVELS = {
  BEGINNER: "beginner" as const,
  INTERMEDIATE: "intermediate" as const,
  ADVANCED: "advanced" as const,
};

export const TOAST_TYPES = {
  SUCCESS: "success" as const,
  ERROR: "error" as const,
  WARNING: "warning" as const,
  INFO: "info" as const,
};

export const DEFAULT_SETTINGS = {
  language: "uk" as const,
  theme: "light" as const,
  soundEnabled: true,
  notificationsEnabled: true,
  offlineMode: false,
};
