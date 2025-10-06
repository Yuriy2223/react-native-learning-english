// app/vocabulary-card.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../components/Button";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { addPoints, incrementKnownWords } from "../redux/user/slice";
import {
  fetchTopicWords,
  markWordAsKnown,
} from "../redux/vocabulary/operations";
import {
  nextWord,
  previousWord,
  updateTopicProgress,
} from "../redux/vocabulary/slice";
import { audioService } from "../services/audio";

const { width } = Dimensions.get("window");

export default function VocabularyCardScreen() {
  const { colors } = useTheme();
  const { showSuccess, showError } = useToast();
  const dispatch = useAppDispatch();

  const params = useLocalSearchParams();
  const topicId = params.topicId as string;
  const topicTitle = params.topicTitle as string;

  const { currentWords, currentWordIndex, isLoading } = useAppSelector(
    (state) => state.vocabulary
  );

  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (topicId && currentWords.length === 0) {
      dispatch(fetchTopicWords(topicId));
    }
  }, [topicId, currentWords.length, dispatch]);

  // Очищення аудіо при виході
  useEffect(() => {
    return () => {
      audioService.stop();
    };
  }, []);

  const currentWord = currentWords[currentWordIndex];

  const handleToggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  const handleWordResponse = async (isKnown: boolean) => {
    if (!currentWord) return;

    try {
      await dispatch(
        markWordAsKnown({
          wordId: currentWord.id,
          isKnown,
        })
      );

      if (isKnown) {
        dispatch(incrementKnownWords());
        dispatch(addPoints(10));
        dispatch(updateTopicProgress({ topicId, increment: 1 }));

        showSuccess({
          message: "Слово додано до вивчених! +10 балів",
        });
      } else {
        showSuccess({
          message: "Продовжуйте вчити!",
        });
      }

      // Перехід до наступного слова
      if (currentWordIndex < currentWords.length - 1) {
        dispatch(nextWord());
        setShowTranslation(false);
      } else {
        showSuccess({
          message: "Вітаємо! Ви завершили всі слова теми!",
          duration: 3000,
        });
        setTimeout(() => router.back(), 1000);
      }
    } catch (error) {
      console.error("Помилка при збереженні результату:", error);
      showError({
        message: "Помилка при збереженні результату",
      });
    }
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      dispatch(previousWord());
      setShowTranslation(false);
      audioService.stop();
    }
  };

  const handlePlayAudio = async () => {
    if (!currentWord || isPlayingAudio) return;

    try {
      setIsPlayingAudio(true);

      if (currentWord.audioUrl) {
        await audioService.playAudioFile(currentWord.audioUrl);
      } else {
        await audioService.playText(currentWord.word, "en");
      }

      setTimeout(() => setIsPlayingAudio(false), 2000);
    } catch (error) {
      console.error("Audio playback error:", error);
      setIsPlayingAudio(false);
      showError({
        message: "Помилка відтворення аудіо",
      });
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.loading,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Завантаження слів...
        </Text>
      </View>
    );
  }

  if (!currentWord) {
    return (
      <View
        style={[
          styles.container,
          styles.loading,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Слова не знайдено
        </Text>
      </View>
    );
  }

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

        <View style={styles.headerInfo}>
          <Text style={[styles.topicTitle, { color: colors.text }]}>
            {topicTitle}
          </Text>
          <Text style={[styles.progress, { color: colors.textSecondary }]}>
            {currentWordIndex + 1} з {currentWords.length}
          </Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View
        style={[styles.progressContainer, { backgroundColor: colors.border }]}
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${((currentWordIndex + 1) / currentWords.length) * 100}%`,
            },
          ]}
        />
      </View>

      {/* Card Container */}
      <View style={styles.cardContainer}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface },
            Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
              },
              android: {
                elevation: 8,
              },
              web: {
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
              },
            }),
          ]}
        >
          <View style={styles.cardContent}>
            {/* Word */}
            <View style={styles.wordContainer}>
              <Text style={[styles.word, { color: colors.text }]}>
                {currentWord.word}
              </Text>

              {/* Transcription */}
              {currentWord.transcription && (
                <Text
                  style={[
                    styles.transcription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {currentWord.transcription}
                </Text>
              )}
            </View>

            {/* Audio Button */}
            <TouchableOpacity
              style={[
                styles.audioButton,
                { backgroundColor: colors.primary + "15" },
                isPlayingAudio && styles.audioButtonActive,
              ]}
              onPress={handlePlayAudio}
              activeOpacity={0.7}
              disabled={isPlayingAudio}
            >
              <Ionicons
                name={isPlayingAudio ? "volume-high" : "volume-medium"}
                size={28}
                color={colors.primary}
              />
            </TouchableOpacity>

            {/* Translation Button/Section */}
            {!showTranslation ? (
              <Button
                title="Переклад"
                onPress={handleToggleTranslation}
                variant="outline"
                style={[
                  styles.translationButton,
                  { borderColor: colors.primary },
                ]}
                textStyle={{ color: colors.primary }}
                icon={
                  <Ionicons name="language" size={20} color={colors.primary} />
                }
              />
            ) : (
              <View
                style={[
                  styles.translationContainer,
                  { backgroundColor: colors.primary + "10" },
                ]}
              >
                <Text style={[styles.translation, { color: colors.primary }]}>
                  {currentWord.translation}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <View style={styles.responseButtons}>
          <Button
            title="Не знаю"
            onPress={() => handleWordResponse(false)}
            variant="outline"
            style={[styles.responseButton, { borderColor: colors.error }]}
            textStyle={{ color: colors.error }}
            icon={
              <Ionicons name="close-circle" size={20} color={colors.error} />
            }
          />

          <Button
            title="Знаю"
            onPress={() => handleWordResponse(true)}
            style={[styles.responseButton, { backgroundColor: colors.success }]}
            icon={<Ionicons name="checkmark-circle" size={20} color="#FFF" />}
          />
        </View>

        {/* Navigation */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              { backgroundColor: colors.surface },
              currentWordIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePreviousWord}
            disabled={currentWordIndex === 0}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={
                currentWordIndex === 0 ? colors.textSecondary : colors.text
              }
            />
          </TouchableOpacity>

          <Text style={[styles.wordCounter, { color: colors.textSecondary }]}>
            {currentWordIndex + 1} / {currentWords.length}
          </Text>

          <View
            style={[
              styles.navButton,
              { backgroundColor: colors.surface, opacity: 0.5 },
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colors.textSecondary}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: SIZES.fontSize.lg,
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
    marginBottom: SIZES.spacing.xl,
  },
  card: {
    width: width - SIZES.spacing.lg * 2,
    minHeight: 400,
    borderRadius: SIZES.borderRadius.xl,
    padding: SIZES.spacing.xl,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SIZES.spacing.xl,
  },
  word: {
    fontSize: SIZES.fontSize.xxl + 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: SIZES.spacing.md,
  },
  transcription: {
    fontSize: SIZES.fontSize.lg,
    fontStyle: "italic",
    textAlign: "center",
  },
  audioButton: {
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
  translationButton: {
    paddingHorizontal: SIZES.spacing.xl,
    minWidth: 150,
  },
  translationContainer: {
    width: "100%",
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  translation: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "600",
    textAlign: "center",
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
  wordCounter: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
  },
});
