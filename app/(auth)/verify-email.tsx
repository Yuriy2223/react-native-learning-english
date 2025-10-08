// import { Ionicons } from "@expo/vector-icons";
// import { router, useLocalSearchParams } from "expo-router";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { SIZES } from "../../constants";
// import { useTheme } from "../../hooks/useTheme";

// export default function VerifyEmailScreen() {
//   const { email } = useLocalSearchParams<{ email: string }>();
//   const { colors } = useTheme();

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <View style={styles.iconContainer}>
//         <Ionicons name="mail-outline" size={80} color={colors.primary} />
//       </View>

//       <Text style={[styles.title, { color: colors.text }]}>
//         Перевірте вашу пошту
//       </Text>

//       <Text style={[styles.message, { color: colors.textSecondary }]}>
//         Ми відправили лист з підтвердженням на:
//       </Text>

//       <Text style={[styles.email, { color: colors.primary }]}>{email}</Text>

//       <Text style={[styles.instruction, { color: colors.textSecondary }]}>
//         Натисніть на посилання у листі, щоб підтвердити вашу адресу електронної
//         пошти.
//       </Text>

//       <TouchableOpacity
//         style={[styles.button, { backgroundColor: colors.primary }]}
//         onPress={() => router.replace("/(auth)/login")}
//       >
//         <Text style={styles.buttonText}>Перейти до входу</Text>
//       </TouchableOpacity>

//       <Text style={[styles.hint, { color: colors.textSecondary }]}>
//         Не отримали лист? Перевірте папку &quot;Спам&quot;
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: SIZES.spacing.xl,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   iconContainer: {
//     marginBottom: SIZES.spacing.xl,
//   },
//   title: {
//     fontSize: SIZES.fontSize.xxl,
//     fontWeight: "bold",
//     marginBottom: SIZES.spacing.md,
//     textAlign: "center",
//   },
//   message: {
//     fontSize: SIZES.fontSize.md,
//     marginBottom: SIZES.spacing.sm,
//     textAlign: "center",
//   },
//   email: {
//     fontSize: SIZES.fontSize.lg,
//     fontWeight: "600",
//     marginBottom: SIZES.spacing.xl,
//     textAlign: "center",
//   },
//   instruction: {
//     fontSize: SIZES.fontSize.md,
//     textAlign: "center",
//     marginBottom: SIZES.spacing.xl,
//     lineHeight: 24,
//   },
//   button: {
//     paddingHorizontal: SIZES.spacing.xl,
//     paddingVertical: SIZES.spacing.md,
//     borderRadius: SIZES.borderRadius.md,
//     marginBottom: SIZES.spacing.lg,
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: SIZES.fontSize.md,
//     fontWeight: "600",
//   },
//   hint: {
//     fontSize: SIZES.fontSize.sm,
//     textAlign: "center",
//     fontStyle: "italic",
//   },
// });
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../../constants";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../hooks/useToast";
import { apiService } from "../../services/api";

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { colors } = useTheme();
  const { showSuccess, showError } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    if (!email) {
      showError({ message: "Email не знайдено" });
      return;
    }

    setIsResending(true);
    try {
      await apiService.resendVerificationEmail(email);
      showSuccess({
        message: "Лист підтвердження відправлено повторно",
        duration: 4000,
      });
    } catch (error) {
      console.error("Resend email error:", error);
      showError({
        message: "Помилка відправки листа. Спробуйте пізніше",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.iconContainer}>
        <Ionicons name="mail-outline" size={80} color={colors.primary} />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>
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
        onPress={() => router.replace("/(auth)/login")}
      >
        <Text style={styles.buttonText}>Перейти до входу</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.resendButton,
          { borderColor: colors.primary },
          isResending && styles.resendButtonDisabled,
        ]}
        onPress={handleResendEmail}
        disabled={isResending}
      >
        <Text
          style={[
            styles.resendButtonText,
            { color: colors.primary },
            isResending && { color: colors.textSecondary },
          ]}
        >
          {isResending ? "Відправка..." : "Відправити лист повторно"}
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
