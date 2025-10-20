import { selectTestResult } from "@/redux/grammar/selectors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { GrammarTestResultItem } from "../components/GrammarTestResultItem";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { useAppSelector } from "../redux/store";

export default function GrammarTestResultScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const topicTitle = params.topicTitle;
  const testResult = useAppSelector(selectTestResult);

  if (!testResult) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          Результати тесту не знайдені
        </Text>
        <Button
          title="Повернутися"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }

  const { score, totalQuestions, percentage, passed, correctAnswers } =
    testResult;

  const getResultColor = () => {
    if (percentage >= 80) return colors.success;
    if (percentage >= 70) return colors.warning;
    return colors.error;
  };

  const getResultIcon = () => (passed ? "checkmark-circle" : "close-circle");

  const getResultMessage = () => {
    if (percentage >= 90) return "Відмінно! Ви чудово знаєте цю тему!";
    if (percentage >= 80) return "Дуже добре! Майже ідеальний результат!";
    if (percentage >= 70) return "Добре! Тест здано успішно!";
    return "На жаль, тест не здано. Спробуйте ще раз!";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Результати тесту
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            {topicTitle}
          </Text>
        </View>

        <View
          style={[
            styles.resultCard,
            { backgroundColor: colors.surface, borderColor: getResultColor() },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getResultColor() + "20" },
            ]}
          >
            <Ionicons
              name={getResultIcon()}
              size={64}
              color={getResultColor()}
            />
          </View>

          <Text style={[styles.percentageText, { color: getResultColor() }]}>
            {percentage}%
          </Text>

          <Text style={[styles.scoreText, { color: colors.textPrimary }]}>
            {score} з {totalQuestions} правильних відповідей
          </Text>

          <Text style={[styles.messageText, { color: colors.textSecondary }]}>
            {getResultMessage()}
          </Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: passed
                  ? colors.success + "20"
                  : colors.error + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: passed ? colors.success : colors.error },
              ]}
            >
              {passed ? "✅ Тест пройдено" : "❌ Тест не пройдено"}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={[styles.detailsTitle, { color: colors.textPrimary }]}>
            Детальні результати
          </Text>

          {correctAnswers.map((result, index) => (
            <GrammarTestResultItem
              key={result.questionId}
              result={result}
              questionNumber={index + 1}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <Button
          title="Повторити тест"
          onPress={() => router.back()}
          variant="outline"
          style={styles.footerButton}
        />
        <Button
          title="До теми"
          onPress={() => {
            router.back();
            router.back();
          }}
          style={styles.footerButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.spacing.xl,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: SIZES.spacing.lg },
  header: { alignItems: "center", marginBottom: SIZES.spacing.xl },
  headerTitle: {
    fontSize: SIZES.fontSize.xxl,
    fontWeight: "bold",
    marginBottom: SIZES.spacing.xs,
  },
  headerSubtitle: { fontSize: SIZES.fontSize.md },
  resultCard: {
    padding: SIZES.spacing.xl,
    borderRadius: SIZES.borderRadius.lg,
    alignItems: "center",
    borderWidth: 2,
    marginBottom: SIZES.spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.spacing.lg,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: SIZES.spacing.sm,
  },
  scoreText: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.md,
  },
  messageText: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
    marginBottom: SIZES.spacing.lg,
    lineHeight: 22,
  },
  statusBadge: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
  },
  statusText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
  detailsContainer: { gap: SIZES.spacing.md },
  detailsTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.sm,
  },
  footer: {
    flexDirection: "row",
    padding: SIZES.spacing.lg,
    gap: SIZES.spacing.md,
  },
  footerButton: { flex: 1 },
  errorText: {
    fontSize: SIZES.fontSize.lg,
    textAlign: "center",
    marginBottom: SIZES.spacing.xl,
  },
  backButton: { minWidth: 200 },
});
