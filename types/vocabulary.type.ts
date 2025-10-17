export interface Word {
  id: string;
  word: string;
  translation: string;
  transcription: string;
  audioUrl?: string;
  topicId: string;
  isKnown: boolean;
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
