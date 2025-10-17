export interface GrammarRule {
  id: string;
  title: string;
  description: string;
  examples: string[];
  topicId: string;
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
