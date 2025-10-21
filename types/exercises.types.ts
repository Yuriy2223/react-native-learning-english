export type ExerciseType = "multiple_choice" | "fill_blank" | "translation";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
  topicId: string;
}

export interface ExerciseTopic {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  totalItems: number;
  completedItems: number;
  difficulty: Difficulty;
  totalScore: number;
  earnedScore: number;
}

export interface ExerciseProgress {
  exerciseId: string;
  isCompleted: boolean;
  earnedPoints: number;
  attempts: number;
}
