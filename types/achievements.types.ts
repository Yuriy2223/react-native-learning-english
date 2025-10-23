export type AchievementType = "bronze" | "silver" | "gold" | "diamond";
export type AchievementCategory =
  | "words"
  | "phrases"
  | "exercises"
  | "grammar"
  | "streak"
  | "points";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: AchievementType;
  category: AchievementCategory;
  target: number;
  points: number;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}
