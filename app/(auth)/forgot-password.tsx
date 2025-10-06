// app/(auth)/forgot-password.tsx
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "../../components/Button";
import { TextInput } from "../../components/TextInput";
import { SIZES } from "../../constants";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../hooks/useToast";
import { forgotPassword } from "../../redux/auth/operations";
import { useAppDispatch } from "../../redux/store";
import { ForgotPasswordFormData } from "../../types";
import { forgotPasswordSchema } from "../../validation";

export default function ForgotPasswordScreen() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(
      forgotPasswordSchema
    ) as Resolver<ForgotPasswordFormData>,
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await dispatch(forgotPassword(data)).unwrap();

      showSuccess({
        message: "Лист з інструкціями відправлено на вашу пошту!",
        duration: 3000,
      });

      router.back();
    } catch (error) {
      console.error("Forgot password error:", error);
      showError({
        message: "Помилка відправки листа. Спробуйте ще раз.",
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
          onPress={() => router.back()}
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
          <Ionicons name="mail" size={48} color={colors.primary} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          Забули пароль?
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Введіть вашу електронну адресу і ми відправимо вам лист з інструкціями
          для відновлення пароля.
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

          <Button
            title="Відправити лист"
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
          <TouchableOpacity onPress={() => router.back()}>
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
