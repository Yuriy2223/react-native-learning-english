// app/achievements.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../components/Button";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";
import { useAppSelector } from "../redux/store";
import { Achievement } from "../types";
import { calculateProgress } from "../utils";

export default function AchievementsScreen() {
  const { colors } = useTheme();
  const { showSuccess } = useToast();

  const { progress: userProgress } = useAppSelector((state) => state.user);
  const { user } = useAppSelector((state) => state.auth);
  const vocabularyTopics = useAppSelector((state) => state.vocabulary.topics);
  const phrasesTopics = useAppSelector((state) => state.phrases.topics);
  const grammarTopics = useAppSelector((state) => state.grammar.topics);

  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!userProgress) return;

    const mockAchievements: Achievement[] = [
      // Словник досягнення
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

      // Фрази досягнення
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

      // Загальні досягнення
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

      // Граматика
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

  const getAchievementTypeColor = (type: string) => {
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

  const getAchievementTypeIcon = (type: string) => {
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

  const handleShareProgress = async () => {
    if (!userProgress || !user) return;

    const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
    const totalCount = achievements.length;

    const shareMessage = `🎓 Мій прогрес у English Learning App:
    
📚 Слова: ${userProgress.knownWords}/${userProgress.totalWords}
💬 Фрази: ${userProgress.knownPhrases}/${userProgress.totalPhrases}
🏆 Досягнення: ${unlockedCount}/${totalCount}
🔥 Серія: ${userProgress.streak} днів
⭐ Бали: ${userProgress.totalPoints}

Приєднуйтесь до вивчення англійської! 🚀`;

    try {
      await Share.share({
        message: shareMessage,
        title: "Мій прогрес у вивченні англійської",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      "Скинути прогрес",
      "Ви впевнені, що хочете скинути весь прогрес? Цю дію не можна відмінити.",
      [
        {
          text: "Скасувати",
          style: "cancel",
        },
        {
          text: "Скинути",
          style: "destructive",
          onPress: () => {
            showSuccess({
              message: "Функція скидання буде доступна в майбутніх версіях",
            });
          },
        },
      ]
    );
  };

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
  const lockedAchievements = achievements.filter((a) => !a.isUnlocked);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Досягнення
        </Text>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareProgress}
        >
          <Ionicons name="share-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Overview */}
        {userProgress && (
          <View
            style={[
              styles.overviewContainer,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text style={[styles.overviewTitle, { color: colors.text }]}>
              Загальний прогрес
            </Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="library" size={24} color={colors.primary} />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {userProgress.knownWords}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Слова
                </Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons
                  name="chatbubbles"
                  size={24}
                  color={colors.secondary}
                />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {userProgress.knownPhrases}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Фрази
                </Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="trophy" size={24} color={colors.warning} />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {unlockedAchievements.length}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Досягнення
                </Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="flame" size={24} color={colors.error} />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {userProgress.streak}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Дні поспіль
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <View style={styles.achievementsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Отримані досягнення ({unlockedAchievements.length})
            </Text>

            <View style={styles.achievementsList}>
              {unlockedAchievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    styles.unlockedCard,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <View
                    style={[
                      styles.achievementIcon,
                      {
                        backgroundColor:
                          getAchievementTypeColor(achievement.type) + "20",
                      },
                    ]}
                  >
                    <Ionicons
                      name={getAchievementTypeIcon(achievement.type) as any}
                      size={24}
                      color={getAchievementTypeColor(achievement.type)}
                    />
                  </View>

                  <View style={styles.achievementContent}>
                    <View style={styles.achievementHeader}>
                      <Text
                        style={[
                          styles.achievementTitle,
                          { color: colors.text },
                        ]}
                      >
                        {achievement.title}
                      </Text>
                      <View
                        style={[
                          styles.typeBadge,
                          {
                            backgroundColor: getAchievementTypeColor(
                              achievement.type
                            ),
                          },
                        ]}
                      >
                        <Text style={styles.typeText}>
                          {achievement.type.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.achievementDescription,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {achievement.description}
                    </Text>

                    {achievement.unlockedAt && (
                      <Text
                        style={[styles.unlockedDate, { color: colors.success }]}
                      >
                        Отримано:{" "}
                        {new Date(achievement.unlockedAt).toLocaleDateString(
                          "uk-UA"
                        )}
                      </Text>
                    )}
                  </View>

                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.success}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <View style={styles.achievementsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Майбутні досягнення ({lockedAchievements.length})
            </Text>

            <View style={styles.achievementsList}>
              {lockedAchievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    styles.lockedCard,
                    { backgroundColor: colors.surface, opacity: 0.7 },
                  ]}
                >
                  <View
                    style={[
                      styles.achievementIcon,
                      { backgroundColor: colors.border },
                    ]}
                  >
                    <Ionicons
                      name="lock-closed"
                      size={24}
                      color={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.achievementContent}>
                    <Text
                      style={[
                        styles.achievementTitle,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {achievement.title}
                    </Text>

                    <Text
                      style={[
                        styles.achievementDescription,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {achievement.description}
                    </Text>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                      <View style={styles.progressInfo}>
                        <Text
                          style={[
                            styles.progressText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          Прогрес: {achievement.progress}/
                          {achievement.maxProgress}
                        </Text>
                        <Text
                          style={[
                            styles.progressPercent,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {calculateProgress(
                            achievement.progress,
                            achievement.maxProgress
                          )}
                          %
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.progressBar,
                          { backgroundColor: colors.border },
                        ]}
                      >
                        <View
                          style={[
                            styles.progressFill,
                            {
                              backgroundColor: getAchievementTypeColor(
                                achievement.type
                              ),
                              width: `${calculateProgress(
                                achievement.progress,
                                achievement.maxProgress
                              )}%`,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Поділитися прогресом"
            onPress={handleShareProgress}
            variant="outline"
            style={styles.actionButton}
          />

          <Button
            title="Скинути прогрес"
            onPress={handleResetProgress}
            variant="outline"
            style={[styles.actionButton, { borderColor: colors.error }]}
            textStyle={{ color: colors.error }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.md,
  },
  backButton: {
    padding: SIZES.spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    textAlign: "center",
  },
  shareButton: {
    padding: SIZES.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  overviewContainer: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  overviewTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.md,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: SIZES.spacing.md,
  },
  statCard: {
    alignItems: "center",
    width: "22%",
  },
  statNumber: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "bold",
    marginTop: SIZES.spacing.xs,
    marginBottom: SIZES.spacing.xs,
  },
  statLabel: {
    fontSize: SIZES.fontSize.xs,
    textAlign: "center",
  },
  achievementsSection: {
    marginBottom: SIZES.spacing.lg,
  },
  sectionTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
  achievementsList: {
    paddingHorizontal: SIZES.spacing.lg,
    gap: SIZES.spacing.md,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.lg,
  },
  unlockedCard: {
    borderWidth: 2,
    borderColor: "transparent",
  },
  lockedCard: {
    borderWidth: 1,
    borderStyle: "dashed",
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.spacing.md,
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SIZES.spacing.xs,
  },
  achievementTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: SIZES.spacing.xs,
    paddingVertical: 2,
    borderRadius: SIZES.borderRadius.sm,
  },
  typeText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  achievementDescription: {
    fontSize: SIZES.fontSize.sm,
    lineHeight: 18,
    marginBottom: SIZES.spacing.xs,
  },
  unlockedDate: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "500",
  },
  progressContainer: {
    marginTop: SIZES.spacing.sm,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.spacing.xs,
  },
  progressText: {
    fontSize: SIZES.fontSize.xs,
  },
  progressPercent: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: "600",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  actionsContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    gap: SIZES.spacing.md,
    marginTop: SIZES.spacing.lg,
  },
  actionButton: {
    width: "100%",
  },
});
