import { Topic } from "@/types/phrases.type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export const navigate = (path: string, params?: Record<string, any>) => {
  if (params) {
    router.push({ pathname: path, params } as any);
  } else {
    router.push(path as any);
  }
};

export const replace = (path: string) => router.replace(path as any);

export const goBack = () => router.back();

export const canGoBack = () => router.canGoBack();

export function calculateProgress(topic: Topic): number {
  const total = topic.totalItems ?? 0;
  const completed = topic.completedItems ?? 0;

  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function getTopicIcon(topic: Topic): keyof typeof Ionicons.glyphMap {
  const title = topic.title.toLowerCase();

  if (title.includes("фраз") || title.includes("розмов")) {
    return "chatbubbles";
  } else if (title.includes("слов") || title.includes("лексик")) {
    return "book";
  } else if (title.includes("граматик")) {
    return "school";
  } else if (title.includes("подорож") || title.includes("travel")) {
    return "airplane";
  } else if (title.includes("їжа") || title.includes("food")) {
    return "restaurant";
  } else if (title.includes("робот") || title.includes("work")) {
    return "briefcase";
  }

  return "chatbubbles";
}

export function getDifficultyColor(
  difficulty: Topic["difficulty"],
  colors: any
): string {
  switch (difficulty) {
    case "beginner":
      return colors.success;
    case "intermediate":
      return colors.warning;
    case "advanced":
      return colors.error;
    default:
      return colors.primary;
  }
}

export const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "Початковий";
    case "intermediate":
      return "Середній";
    case "advanced":
      return "Складний";
    default:
      return "";
  }
};
