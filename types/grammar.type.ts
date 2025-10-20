export interface GrammarRule {
  id: string;
  title: string;
  description: string;
  examples: string[];
  topicId: string;
  isCompleted?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  totalItems: number;
  completedItems: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface GrammarQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface TestResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  correctAnswers: {
    questionId: string;
    correctAnswer: number;
    userAnswer: number;
    isCorrect: boolean;
    explanation?: string;
  }[];
}
