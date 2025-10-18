import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/store";
import { Achievement } from "../types";

export function useAchievements() {
  const { progress: userProgress } = useAppSelector((state) => state.user);
  const vocabularyTopics = useAppSelector((state) => state.vocabulary.topics);
  const phrasesTopics = useAppSelector((state) => state.phrases.topics);
  const grammarTopics = useAppSelector((state) => state.grammar.topics);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!userProgress) return;

    const mockAchievements: Achievement[] = [
      {
        id: "first_word",
        title: "Перше слово",
        description: "Вивчіть своє перше слово",
        icon: "library",
        type: "bronze",
        isUnlocked: userProgress.knownWords > 0,
        progress: Math.min(userProgress.knownWords, 1),
        maxProgress: 1,
        unlockedAt: userProgress.knownWords > 0 ? "2024-01-15" : undefined,
      },
      {
        id: "word_collector",
        title: "Колекціонер слів",
        description: "Вивчіть 50 слів",
        icon: "book",
        type: "silver",
        isUnlocked: userProgress.knownWords >= 50,
        progress: Math.min(userProgress.knownWords, 50),
        maxProgress: 50,
        unlockedAt: userProgress.knownWords >= 50 ? "2024-01-20" : undefined,
      },
      {
        id: "vocabulary_master",
        title: "Майстер словника",
        description: "Вивчіть 200 слів",
        icon: "library",
        type: "gold",
        isUnlocked: userProgress.knownWords >= 200,
        progress: Math.min(userProgress.knownWords, 200),
        maxProgress: 200,
        unlockedAt: userProgress.knownWords >= 200 ? "2024-02-01" : undefined,
      },
      {
        id: "first_phrase",
        title: "Перша фраза",
        description: "Вивчіть свою першу фразу",
        icon: "chatbubble",
        type: "bronze",
        isUnlocked: userProgress.knownPhrases > 0,
        progress: Math.min(userProgress.knownPhrases, 1),
        maxProgress: 1,
        unlockedAt: userProgress.knownPhrases > 0 ? "2024-01-16" : undefined,
      },
      {
        id: "conversation_starter",
        title: "Початок розмови",
        description: "Вивчіть 25 фраз",
        icon: "chatbubbles",
        type: "silver",
        isUnlocked: userProgress.knownPhrases >= 25,
        progress: Math.min(userProgress.knownPhrases, 25),
        maxProgress: 25,
        unlockedAt: userProgress.knownPhrases >= 25 ? "2024-01-22" : undefined,
      },
      {
        id: "fluent_speaker",
        title: "Вільний спікер",
        description: "Вивчіть 100 фраз",
        icon: "megaphone",
        type: "gold",
        isUnlocked: userProgress.knownPhrases >= 100,
        progress: Math.min(userProgress.knownPhrases, 100),
        maxProgress: 100,
      },
      {
        id: "points_collector",
        title: "Збирач балів",
        description: "Зберіть 1000 балів",
        icon: "trophy",
        type: "silver",
        isUnlocked: userProgress.totalPoints >= 1000,
        progress: Math.min(userProgress.totalPoints, 1000),
        maxProgress: 1000,
        unlockedAt: userProgress.totalPoints >= 1000 ? "2024-01-25" : undefined,
      },
      {
        id: "streak_warrior",
        title: "Воїн серії",
        description: "Навчайтеся 7 днів поспіль",
        icon: "flame",
        type: "gold",
        isUnlocked: userProgress.streak >= 7,
        progress: Math.min(userProgress.streak, 7),
        maxProgress: 7,
        unlockedAt: userProgress.streak >= 7 ? "2024-01-18" : undefined,
      },
      {
        id: "learning_machine",
        title: "Машина навчання",
        description: "Навчайтеся 30 днів поспіль",
        icon: "fitness",
        type: "diamond",
        isUnlocked: userProgress.streak >= 30,
        progress: Math.min(userProgress.streak, 30),
        maxProgress: 30,
      },
      {
        id: "grammar_novice",
        title: "Новачок граматики",
        description: "Завершіть першу граматичну тему",
        icon: "school",
        type: "bronze",
        isUnlocked: grammarTopics.some(
          (t) => t.completedItems === t.totalItems
        ),
        progress:
          grammarTopics.filter((t) => t.completedItems === t.totalItems)
            .length > 0
            ? 1
            : 0,
        maxProgress: 1,
      },
    ];

    setAchievements(mockAchievements);
  }, [userProgress, vocabularyTopics, phrasesTopics, grammarTopics]);

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
  const lockedAchievements = achievements.filter((a) => !a.isUnlocked);

  return {
    achievements,
    unlockedAchievements,
    lockedAchievements,
    userProgress,
  };
}
