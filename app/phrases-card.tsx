import { Spinner } from "@/components/Spinner";
import { Phrase } from "@/types/phrases.type";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../components/Button";
import { SHADOWS, SIZES } from "../constants";
import { showToast } from "../hooks/showToast";
import { useTheme } from "../hooks/useTheme";
import {
  fetchTopicPhrases,
  markPhraseAsKnown,
} from "../redux/phrases/operations";
import { nextPhrase, updateTopicProgress } from "../redux/phrases/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { addPoints, incrementKnownPhrases } from "../redux/user/slice";
import { audioService } from "../services/audio";

const { width } = Dimensions.get("window");

export default function PhraseCardScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const topicId = params.topicId as string;
  const topicTitle = params.topicTitle as string;
  const { currentPhrases, currentPhraseIndex, isLoading } = useAppSelector(
    (state) => state.phrases
  );

  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (topicId && currentPhrases.length === 0) {
      dispatch(fetchTopicPhrases(topicId));
    }
  }, [topicId, currentPhrases.length, dispatch]);

  useEffect(() => {
    return () => {
      audioService.stop();
    };
  }, []);

  useEffect(() => {
    setShowTranslation(false);
    audioService.stop();
  }, [currentPhraseIndex]);

  const currentPhrase: Phrase | undefined = currentPhrases[currentPhraseIndex];

  const handlePhraseResponse = async (isKnown: boolean) => {
    if (!currentPhrase) return;

    try {
      await dispatch(
        markPhraseAsKnown({
          phraseId: currentPhrase.id,
          isKnown,
        })
      ).unwrap();

      if (isKnown) {
        dispatch(incrementKnownPhrases());
        dispatch(addPoints(15));
        dispatch(updateTopicProgress({ topicId, increment: 1 }));

        showToast.success({
          message: "Фразу додано до вивчених! +15 балів",
        });
      } else {
        showToast.info({
          message: "Продовжуйте вчити!",
        });
      }

      if (currentPhraseIndex < currentPhrases.length - 1) {
        dispatch(nextPhrase());
      } else {
        showToast.success({
          message: "Вітаємо! Ви завершили всі фрази теми!",
          duration: 3000,
        });
        setTimeout(() => router.back(), 1500);
      }
    } catch (error) {
      console.error("Error marking phrase:", error);
      showToast.error({
        message: "Помилка при збереженні результату",
      });
    }
  };

  const handlePlayAudio = async () => {
    if (!currentPhrase || isPlayingAudio) return;

    try {
      setIsPlayingAudio(true);

      if (currentPhrase.audioUrl) {
        await audioService.playAudioFile(currentPhrase.audioUrl);
      } else {
        await audioService.playText(currentPhrase.phrase, "en");
      }

      setTimeout(() => setIsPlayingAudio(false), 1000);
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlayingAudio(false);
      showToast.error({
        message: "Помилка відтворення аудіо",
      });
    }
  };

  if (isLoading && currentPhrases.length === 0) {
    return <Spinner />;
  }

  if (!currentPhrase) {
    return (
      <View
        style={[
          styles.container,
          styles.loading,
          { backgroundColor: colors.background },
        ]}
      >
        <Ionicons
          name="chatbubbles-outline"
          size={64}
          color={colors.textSecondary}
        />
        <Text
          style={[
            styles.loadingText,
            { color: colors.textPrimary, marginTop: SIZES.spacing.md },
          ]}
        >
          Фрази не знайдено
        </Text>
        <Button
          title="Повернутися"
          onPress={() => router.back()}
          variant="outline"
          style={{ marginTop: SIZES.spacing.lg }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={[styles.topicTitle, { color: colors.textPrimary }]}>
            {topicTitle}
          </Text>
          <Text style={[styles.progress, { color: colors.textSecondary }]}>
            {currentPhraseIndex + 1} з {currentPhrases.length}
          </Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      <View
        style={[styles.progressContainer, { backgroundColor: colors.border }]}
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.secondary,
              width: `${
                ((currentPhraseIndex + 1) / currentPhrases.length) * 100
              }%`,
            },
          ]}
        />
      </View>

      <View style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardContent}>
            <View style={styles.phraseContainer}>
              <Text style={[styles.phrase, { color: colors.textPrimary }]}>
                {currentPhrase.phrase}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.audioButtonCard,
                { backgroundColor: colors.secondary + "15" },
                isPlayingAudio && styles.audioButtonActive,
              ]}
              onPress={handlePlayAudio}
              disabled={isPlayingAudio}
            >
              <Ionicons
                name={isPlayingAudio ? "volume-high" : "volume-medium"}
                size={28}
                color={colors.secondary}
              />
            </TouchableOpacity>

            <Button
              title={showTranslation ? "Сховати переклад" : "Переклад"}
              onPress={() => setShowTranslation(!showTranslation)}
              variant="outline"
              style={[
                styles.translateButton,
                { borderColor: colors.secondary },
              ]}
              textStyle={{ color: colors.secondary }}
              icon={
                <Ionicons name="language" size={20} color={colors.secondary} />
              }
            />

            {showTranslation && (
              <View style={styles.translationBox}>
                <Text
                  style={[styles.translation, { color: colors.textPrimary }]}
                >
                  {currentPhrase.translation}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <View style={styles.responseButtons}>
          <Button
            title="Не знаю"
            onPress={() => handlePhraseResponse(false)}
            variant="outline"
            style={[styles.responseButton, { borderColor: colors.error }]}
            textStyle={{ color: colors.error }}
            icon={
              <Ionicons name="close-circle" size={20} color={colors.error} />
            }
          />

          <Button
            title="Знаю"
            onPress={() => handlePhraseResponse(true)}
            style={[styles.responseButton, { backgroundColor: colors.success }]}
            icon={<Ionicons name="checkmark-circle" size={20} color="#FFF" />}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.spacing.xl,
  },
  loadingText: {
    fontSize: SIZES.fontSize.lg,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.md,
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
  },
  topicTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
  progress: {
    fontSize: SIZES.fontSize.sm,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    height: 4,
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.xl,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.lg,
  },
  card: {
    width: width - SIZES.spacing.lg * 2,
    borderRadius: SIZES.borderRadius.xl,
    ...SHADOWS.small,
  },
  cardContent: {
    paddingHorizontal: SIZES.spacing.xl,
    paddingVertical: SIZES.spacing.xl,
    alignItems: "center",
  },
  phraseContainer: {
    paddingVertical: SIZES.spacing.xl,
  },
  phrase: {
    fontSize: SIZES.fontSize.xxl,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 36,
  },
  audioButtonCard: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.spacing.lg,
  },
  audioButtonActive: {
    transform: [{ scale: 1.1 }],
  },
  translateButton: {
    paddingHorizontal: SIZES.spacing.xl,
    minWidth: 150,
    marginBottom: SIZES.spacing.md,
  },
  translationBox: {
    width: "100%",
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
    marginTop: SIZES.spacing.md,
    backgroundColor: "#F0F0F0",
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  translation: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 28,
  },
  actionsContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xl,
  },
  responseButtons: {
    flexDirection: "row",
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.lg,
  },
  responseButton: {
    flex: 1,
  },
  navigationButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  phraseCounter: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
  },
});
