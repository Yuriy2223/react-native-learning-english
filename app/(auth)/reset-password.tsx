// app/(auth)/reset-password.tsx
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as yup from "yup";
import { Button } from "../../components/Button";
import { TextInput } from "../../components/TextInput";
import { SIZES } from "../../constants";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../hooks/useToast";
import { apiService } from "../../services/api";
import { navigate } from "../../utils";

interface ResetPasswordFormData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

const resetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Введіть коректний email")
    .required("Email обов'язковий"),
  newPassword: yup
    .string()
    .min(6, "Пароль повинен містити мінімум 6 символів")
    .required("Пароль обов'язковий"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Паролі не співпадають")
    .required("Підтвердження пароля обов'язкове"),
});

export default function ResetPasswordScreen() {
  const { colors } = useTheme();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams<{ token?: string }>();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(
      resetPasswordSchema
    ) as Resolver<ResetPasswordFormData>,
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!params.token) {
      showError({
        message: "Недійсне посилання для скидання пароля",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiService.resetPassword(
        data.email,
        params.token,
        data.newPassword
      );

      showSuccess({
        message: "Пароль успішно змінено!",
        duration: 3000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Reset password error:", error);
      showError({
        message: error.message || "Помилка скидання пароля. Спробуйте ще раз.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigate("/login")}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.primary + "20" },
          ]}
        >
          <Ionicons name="lock-closed" size={48} color={colors.primary} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>Новий пароль</Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Введіть ваш email та новий пароль
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                placeholder="Введіть ваш email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Новий пароль"
                placeholder="Введіть новий пароль"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.newPassword?.message}
                secureTextEntry
                leftIcon={
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Підтвердіть пароль"
                placeholder="Підтвердіть новий пароль"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                secureTextEntry
                leftIcon={
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                }
              />
            )}
          />

          <Button
            title="Змінити пароль"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={!isValid}
            style={styles.submitButton}
          />
        </View>

        {/* Back to Login */}
        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>
            Згадали пароль?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigate("/login")}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>
              Увійти
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.lg,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.spacing.xl,
  },
  title: {
    fontSize: SIZES.fontSize.xxl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: SIZES.spacing.md,
  },
  subtitle: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SIZES.spacing.xl,
    paddingHorizontal: SIZES.spacing.md,
  },
  form: {
    width: "100%",
    marginBottom: SIZES.spacing.xl,
  },
  submitButton: {
    marginTop: SIZES.spacing.md,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: SIZES.fontSize.md,
  },
  loginLink: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
});
