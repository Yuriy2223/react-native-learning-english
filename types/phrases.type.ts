export interface Phrase {
  id: string;
  phrase: string;
  translation: string;
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
