export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  totalStudyHours: number;
  createdAt: string;
}

export interface Word {
  id: string;
  word: string;
  translation: string;
  transcription: string;
  audioUrl?: string;
  topicId: string;
  isKnown: boolean;
}

export interface Phrase {
  id: string;
  phrase: string;
  translation: string;
  audioUrl?: string | null;
  topicId: string;
  isKnown: boolean;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  totalItems: number;
  completedItems: number;
  type: "vocabulary" | "phrases" | "grammar";
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface GrammarRule {
  id: string;
  title: string;
  description: string;
  examples: string[];
  topicId: string;
}

export interface Exercise {
  id: string;
  type: "multiple_choice" | "drag_drop" | "audio" | "fill_blank";
  question: string;
  options?: string[];
  correctAnswer: string;
  audioUrl?: string;
  points: number;
}

export interface UserProgress {
  totalWords: number;
  knownWords: number;
  totalPhrases: number;
  knownPhrases: number;
  completedTopics: number;
  totalPoints: number;
  streak: number;
}

export interface AppSettings {
  language: "uk" | "en";
  theme: "light" | "dark";
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  offlineMode: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "bronze" | "silver" | "gold" | "diamond";
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}
