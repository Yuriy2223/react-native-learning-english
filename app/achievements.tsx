import { selectUser } from "@/redux/user/selectors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AchievementProgressStats } from "../components/AchievementProgressStats";
import { AchievementsList } from "../components/AchievementsList";
import { Button } from "../components/Button";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { SIZES } from "../constants";
import { useAchievements } from "../hooks/useAchievements";
import { useTheme } from "../hooks/useTheme";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { resetProgress } from "../redux/user/operations";

export default function AchievementsScreen() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const user = useAppSelector(selectUser);
  const {
    achievements,
    unlockedAchievements,
    lockedAchievements,
    userProgress,
  } = useAchievements();
  const [showResetModal, setShowResetModal] = useState(false);

  const handleShareProgress = async () => {
    if (!userProgress || !user) return;

    const unlockedCount = unlockedAchievements.length;
    const totalCount = achievements.length;
    const shareMessage = `🎓 Мій прогрес у English Learning:
    
📚 Слова: ${userProgress.knownWords}/${userProgress.totalWords}
💬 Фрази: ${userProgress.knownPhrases}/${userProgress.totalPhrases}
🏆 Досягнення: ${unlockedCount}/${totalCount}
🔥 Серія: ${userProgress.streak} днів
⭐ Бали: ${userProgress.totalPoints}

Приєднуйтесь до вивчення англійської!`;

    try {
      await Share.share({
        message: shareMessage,
        title: "Мій прогрес у вивченні англійської",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleResetProgress = async () => {
    try {
      await dispatch(resetProgress()).unwrap();
      setShowResetModal(false);
    } catch (error) {
      console.error("Reset error:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
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
        {userProgress && (
          <AchievementProgressStats
            knownWords={userProgress.knownWords}
            knownPhrases={userProgress.knownPhrases}
            unlockedAchievementsCount={unlockedAchievements.length}
            streak={userProgress.streak}
          />
        )}

        <AchievementsList
          achievements={unlockedAchievements}
          title="Отримані досягнення"
          isLocked={false}
        />

        <AchievementsList
          achievements={lockedAchievements}
          title="Майбутні досягнення"
          isLocked={true}
        />

        <View style={styles.actionsContainer}>
          <Button
            title="Поділитися прогресом"
            onPress={handleShareProgress}
            variant="outline"
            style={styles.actionButton}
          />

          <Button
            title="Скинути прогрес"
            onPress={() => setShowResetModal(true)}
            variant="outline"
            style={[styles.actionButton, { borderColor: colors.error }]}
            textStyle={{ color: colors.error }}
          />
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={showResetModal}
        title="Скинути прогрес?"
        message="Ви впевнені, що хочете скинути весь прогрес?"
        confirmText="Скинути"
        cancelText="Скасувати"
        confirmButtonVariant="danger"
        icon="warning"
        iconColor={colors.error}
        onConfirm={handleResetProgress}
        onCancel={() => setShowResetModal(false)}
      />
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
  actionsContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    gap: SIZES.spacing.md,
    marginTop: SIZES.spacing.lg,
  },
  actionButton: {
    width: "100%",
  },
});
