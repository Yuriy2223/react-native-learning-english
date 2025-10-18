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

export function calculateProgressFromNumbers(
  current: number,
  max: number
): number {
  if (max === 0) return 0;
  return Math.round((current / max) * 100);
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

export const getAchievementTypeColor = (type: string, colors: any) => {
  switch (type) {
    case "bronze":
      return "#CD7F32";
    case "silver":
      return "#C0C0C0";
    case "gold":
      return "#FFD700";
    case "diamond":
      return "#B9F2FF";
    default:
      return colors.textSecondary;
  }
};

export const getAchievementTypeIcon = (type: string) => {
  switch (type) {
    case "bronze":
      return "medal";
    case "silver":
      return "medal";
    case "gold":
      return "trophy";
    case "diamond":
      return "diamond";
    default:
      return "ribbon";
  }
};

export const getExerciseTypeIcon = (type: string) => {
  switch (type) {
    case "multiple_choice":
      return "radio-button-on";
    case "fill_blank":
      return "create";
    case "drag_drop":
      return "move";
    case "audio":
      return "volume-high";
    default:
      return "help-circle";
  }
};

export const getExerciseTypeLabel = (type: string) => {
  switch (type) {
    case "multiple_choice":
      return "Множинний вибір";
    case "fill_blank":
      return "Заповнити пропуск";
    case "drag_drop":
      return "Перетягування";
    case "audio":
      return "Аудіо вправа";
    default:
      return "Вправа";
  }
};
