export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
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
