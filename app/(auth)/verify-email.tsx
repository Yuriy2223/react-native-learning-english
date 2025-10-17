import { resendVerification } from "@/redux/auth/operations";
import { selectEmailToVerify, selectIsLoading } from "@/redux/auth/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { replace } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../../constants";
import { useTheme } from "../../hooks/useTheme";

export default function VerifyEmailScreen() {
  const { email: paramEmail } = useLocalSearchParams<{ email: string }>();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const emailToVerify = useAppSelector(selectEmailToVerify);
  const email = paramEmail || emailToVerify;

  const handleResendEmail = async () => {
    if (!email) return;

    try {
      await dispatch(resendVerification(email)).unwrap();
    } catch (error) {
      console.error("Resend verification error:", error);
    }
  };

  if (!email) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle" size={80} color={colors.error} />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Email не знайдено
        </Text>

        <Text style={[styles.message, { color: colors.textSecondary }]}>
          Не вдалося визначити email адресу для верифікації
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => replace("/(auth)/register")}
        >
          <Text style={styles.buttonText}>Повернутися до реєстрації</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.iconContainer}>
        <Ionicons name="mail-outline" size={80} color={colors.primary} />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Перевірте вашу пошту
      </Text>

      <Text style={[styles.message, { color: colors.textSecondary }]}>
        Ми відправили лист з підтвердженням на:
      </Text>

      <Text style={[styles.email, { color: colors.primary }]}>{email}</Text>

      <Text style={[styles.instruction, { color: colors.textSecondary }]}>
        Натисніть на посилання у листі, щоб підтвердити вашу адресу електронної
        пошти.
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => replace("/(auth)/login")}
      >
        <Text style={styles.buttonText}>Перейти до входу</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.resendButton,
          { borderColor: colors.primary },
          isLoading && styles.resendButtonDisabled,
        ]}
        onPress={handleResendEmail}
        disabled={isLoading}
      >
        <Text
          style={[
            styles.resendButtonText,
            { color: colors.primary },
            isLoading && { color: colors.textSecondary },
          ]}
        >
          {isLoading ? "Відправка..." : "Відправити лист повторно"}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Не отримали лист? Перевірте папку &quot;Спам&quot;
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.spacing.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: SIZES.spacing.xl,
  },
  title: {
    fontSize: SIZES.fontSize.xxl,
    fontWeight: "bold",
    marginBottom: SIZES.spacing.md,
    textAlign: "center",
  },
  message: {
    fontSize: SIZES.fontSize.md,
    marginBottom: SIZES.spacing.sm,
    textAlign: "center",
  },
  email: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.xl,
    textAlign: "center",
  },
  instruction: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
    marginBottom: SIZES.spacing.xl,
    lineHeight: 24,
  },
  button: {
    paddingHorizontal: SIZES.spacing.xl,
    paddingVertical: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.spacing.md,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
  resendButton: {
    paddingHorizontal: SIZES.spacing.xl,
    paddingVertical: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    borderWidth: 1,
    marginBottom: SIZES.spacing.lg,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
  hint: {
    fontSize: SIZES.fontSize.sm,
    textAlign: "center",
    fontStyle: "italic",
  },
});
