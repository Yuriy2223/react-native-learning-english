// app/phrases-card.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
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
import {
  fetchTopicPhrases,
  markPhraseAsKnown,
} from "../redux/phrases/operations";
import {
  nextPhrase,
  previousPhrase,
  updateTopicProgress,
} from "../redux/phrases/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { addPoints, incrementKnownPhrases } from "../redux/user/slice";
import { audioService } from "../services/audio";

const { width } = Dimensions.get("window");

export default function PhraseCardScreen() {
  const { colors } = useTheme();
  const { showSuccess, showError } = useToast();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const topicId = params.topicId as string;
  const topicTitle = params.topicTitle as string;

  const { currentPhrases, currentPhraseIndex, isLoading } = useAppSelector(
    (state) => state.phrases
  );

  const [showTranslation, setShowTranslation] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    console.log("Phrases Card mounted with:", {
      topicId,
      currentPhrases: currentPhrases.length,
    });
    if (topicId && currentPhrases.length === 0) {
      dispatch(fetchTopicPhrases(topicId));
    }
  }, [topicId, currentPhrases.length, dispatch]);

  // Очищення аудіо при виході
  useEffect(() => {
    return () => {
      audioService.stop();
    };
  }, []);

  const currentPhrase = currentPhrases[currentPhraseIndex];

  const handleShowTranslation = () => {
    if (showTranslation) return; // Вже показано

    Animated.spring(flipAnimation, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 10,
    }).start();
    setShowTranslation(true);
  };

  const handlePhraseResponse = async (isKnown: boolean) => {
    if (!currentPhrase) return;

    try {
      await dispatch(
        markPhraseAsKnown({
          phraseId: currentPhrase.id,
          isKnown,
        })
      );

      if (isKnown) {
        dispatch(incrementKnownPhrases());
        dispatch(addPoints(15));
        dispatch(updateTopicProgress({ topicId, increment: 1 }));

        showSuccess({
          message: "Фразу додано до вивчених! +15 балів",
        });
      } else {
        showSuccess({
          message: "Продовжуйте вчити!",
        });
      }

      // Перехід до наступної фрази
      if (currentPhraseIndex < currentPhrases.length - 1) {
        dispatch(nextPhrase());
        setShowTranslation(false);
        flipAnimation.setValue(0);
      } else {
        // Закінчили всі фрази в темі
        showSuccess({
          message: "Вітаємо! Ви завершили всі фрази теми!",
          duration: 3000,
        });
        setTimeout(() => router.back(), 1000);
      }
    } catch (error) {
      console.error("Error marking phrase:", error);
      showError({
        message: "Помилка при збереженні результату",
      });
    }
  };

  const handlePreviousPhrase = () => {
    if (currentPhraseIndex > 0) {
      dispatch(previousPhrase());
      setShowTranslation(false);
      flipAnimation.setValue(0);
      audioService.stop();
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

      // Затримка для анімації кнопки
      setTimeout(() => setIsPlayingAudio(false), 1000);
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlayingAudio(false);
      showError({
        message: "Помилка відтворення аудіо",
      });
    }
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

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
          Завантаження фраз...
        </Text>
      </View>
    );
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
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Фрази не знайдено
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
            {currentPhraseIndex + 1} з {currentPhrases.length}
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
              backgroundColor: colors.secondary,
              width: `${
                ((currentPhraseIndex + 1) / currentPhrases.length) * 100
              }%`,
            },
          ]}
        />
      </View>

      {/* Card Container */}
      <View style={styles.cardContainer}>
        <View style={styles.cardWrapper}>
          {/* Front Side - Фраза англійською */}
          <Animated.View
            style={[
              styles.card,
              { backgroundColor: colors.surface },
              {
                transform: [{ rotateY: frontInterpolate }],
                opacity: frontOpacity,
              },
            ]}
            pointerEvents={showTranslation ? "none" : "auto"}
          >
            <View style={styles.cardContent}>
              <View style={styles.phraseContainer}>
                <Text style={[styles.phrase, { color: colors.text }]}>
                  {currentPhrase.phrase}
                </Text>
              </View>

              {/* Кнопка озвучення на картці */}
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

              {/* Кнопка "Переклад" */}
              <Button
                title="Переклад"
                onPress={handleShowTranslation}
                variant="outline"
                style={[
                  styles.translateButton,
                  { borderColor: colors.secondary },
                ]}
                textStyle={{ color: colors.secondary }}
                icon={
                  <Ionicons
                    name="language"
                    size={20}
                    color={colors.secondary}
                  />
                }
              />
            </View>
          </Animated.View>

          {/* Back Side - Переклад */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              { backgroundColor: colors.secondary },
              {
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity,
              },
            ]}
            pointerEvents={showTranslation ? "auto" : "none"}
          >
            <View style={styles.cardContent}>
              <View style={styles.translationContainer}>
                <Text style={styles.translation}>
                  {currentPhrase.translation}
                </Text>
              </View>

              <Text style={styles.originalPhrase}>{currentPhrase.phrase}</Text>

              <View style={styles.translationHint}>
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF80" />
                <Text style={styles.hintText}>Тепер оберіть відповідь</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </View>

      {/* Action Buttons */}
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

        {/* Navigation */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              { backgroundColor: colors.surface },
              currentPhraseIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePreviousPhrase}
            disabled={currentPhraseIndex === 0}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={
                currentPhraseIndex === 0 ? colors.textSecondary : colors.text
              }
            />
          </TouchableOpacity>

          <Text style={[styles.phraseCounter, { color: colors.textSecondary }]}>
            {currentPhraseIndex + 1} / {currentPhrases.length}
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
  },
  cardWrapper: {
    width: width - SIZES.spacing.lg * 2,
    height: 400,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: SIZES.borderRadius.xl,
    backfaceVisibility: "hidden",
    ...Platform.select({
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
  },
  cardBack: {
    position: "absolute",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.spacing.xl,
  },
  phraseContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  translationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SIZES.spacing.xl,
  },
  translation: {
    fontSize: SIZES.fontSize.xxl,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 36,
    color: "#FFFFFF",
  },
  originalPhrase: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
    marginBottom: SIZES.spacing.lg,
    fontStyle: "italic",
    color: "#FFFFFF80",
  },
  translationHint: {
    alignItems: "center",
  },
  hintText: {
    fontSize: SIZES.fontSize.sm,
    marginTop: SIZES.spacing.xs,
    textAlign: "center",
    color: "#FFFFFF80",
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
