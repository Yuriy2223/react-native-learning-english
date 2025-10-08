// app/(auth)/register.tsx
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "../../components/Button";
import { TextInput } from "../../components/TextInput";
import { SIZES } from "../../constants";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../hooks/useToast";
import { registerUser } from "../../redux/auth/operations";
import { setUser } from "../../redux/auth/slice";
import { useAppDispatch } from "../../redux/store";
import { apiService } from "../../services/api";
import { RegisterFormData } from "../../types";
import { authUtils } from "../../utils";
import { registerSchema } from "../../validation";

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { showSuccess, showError, showInfo } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as Resolver<RegisterFormData>,
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // const onSubmit = async (data: RegisterFormData) => {
  //   setIsLoading(true);
  //   try {
  //     await dispatch(registerUser(data)).unwrap();

  //     showSuccess({
  //       message: "Акаунт успішно створено!",
  //     });

  //     router.replace("/home");
  //   } catch (error) {
  //     console.error("Помилка реєстрації:", error);
  //     showError({
  //       message: "Помилка реєстрації. Спробуйте ще раз.",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await dispatch(registerUser(data)).unwrap();

      // Показуємо інформаційне повідомлення
      showInfo({
        message:
          result.message || "Перевірте вашу пошту для підтвердження акаунту",
      });

      // Зберігаємо email для наступного екрану
      // Переходимо на екран з інструкціями
      router.replace({
        pathname: "/(auth)/verify-email",
        params: { email: data.email },
      });
    } catch (error: any) {
      console.error("Помилка реєстрації:", error);
      showError({
        message: error || "Помилка реєстрації. Спробуйте ще раз.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // const onSubmit = async (data: RegisterFormData) => {
  //   setIsLoading(true);
  //   try {
  //     const result = await dispatch(registerUser(data)).unwrap();

  //     // Показуємо повідомлення про верифікацію
  //     showInfo({
  //       message:
  //         result.message || "Перевірте вашу пошту для підтвердження акаунту",
  //     });

  //     // Переходимо на екран логіну, а не home
  //     router.replace("/(auth)/login");
  //   } catch (error: any) {
  //     console.error("Помилка реєстрації:", error);
  //     showError({
  //       message: error || "Помилка реєстрації. Спробуйте ще раз.",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleGoogleRegister = async () => {
    try {
      const { socialAuthService } = await import("../../services/socialAuth");
      const result = await socialAuthService.signInWithGoogle();

      if (result.type === "success" && result.user && result.token) {
        await authUtils.saveAuthToken(result.token);
        apiService.setAuthToken(result.token);
        await authUtils.saveUserData(result.user);

        const fullUser = {
          totalStudyHours: 0,
          createdAt: new Date().toISOString(),
          ...result.user,
        };

        dispatch(setUser(fullUser));

        showSuccess({
          message: `Вітаємо, ${result.user.name}! Акаунт створено через Google`,
        });

        router.replace("/home");
      } else if (result.type === "cancel") {
        showInfo({
          message: "Реєстрацію скасовано",
        });
      } else {
        showError({
          message: result.error || "Помилка реєстрації через Google",
        });
      }
    } catch (error) {
      console.error("Помилка реєстрації через Google:", error);
      showError({
        message: "Помилка реєстрації через Google",
      });
    }
  };

  // const handleAppleRegister = async () => {
  //   try {
  //     const { socialAuthService } = await import("../../services/socialAuth");

  //     if (!socialAuthService.isAppleAvailable()) {
  //       showError({
  //         message: "Apple Sign In доступний тільки на iOS",
  //       });
  //       return;
  //     }

  //     const result = await socialAuthService.signInWithApple();

  //     if (result.type === "success" && result.user && result.token) {
  //       await authUtils.saveAuthToken(result.token);
  //       apiService.setAuthToken(result.token);
  //       await authUtils.saveUserData(result.user);

  //       const fullUser = {
  //         totalStudyHours: 0,
  //         createdAt: new Date().toISOString(),
  //         ...result.user,
  //       };

  //       dispatch(setUser(fullUser));

  //       showSuccess({
  //         message: `Вітаємо, ${result.user.name}! Акаунт створено через Apple ID`,
  //       });

  //       router.replace("/home");
  //     } else if (result.type === "cancel") {
  //       showInfo({
  //         message: "Реєстрацію скасовано",
  //       });
  //     } else {
  //       showError({
  //         message: result.error || "Помилка реєстрації через Apple ID",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Помилка реєстрації через Apple ID:", error);
  //     showError({
  //       message: "Помилка реєстрації через Apple ID",
  //     });
  //   }
  // };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Створення акаунту
        </Text>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View
          style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.logoText}>🎓</Text>
        </View>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Ласкаво просимо!
        </Text>
        <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
          Створіть акаунт для початку навчання
        </Text>
      </View>

      {/* Register Form */}
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Ім'я"
              placeholder="Введіть ваше ім'я"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              leftIcon={
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              }
            />
          )}
        />

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
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Пароль"
              placeholder="Створіть пароль"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              secureTextEntry={!showPassword}
              leftIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              }
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Підтвердження пароля"
              placeholder="Повторіть пароль"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
              secureTextEntry={!showConfirmPassword}
              leftIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              }
            />
          )}
        />

        <Button
          title="Створити акаунт"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={!isValid}
          style={styles.registerButton}
        />

        {/* Social Register */}
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
            або
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.socialButtons}>
          <Button
            title="Реєстрація через Google"
            onPress={handleGoogleRegister}
            variant="outline"
            style={styles.socialButton}
          />

          {/* <Button
            title="Реєстрація через Apple"
            onPress={handleAppleRegister}
            variant="outline"
            style={styles.socialButton}
          /> */}
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>
            Вже маєте акаунт?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>
              Увійти
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.spacing.lg,
    marginTop: SIZES.spacing.md,
  },
  backButton: {
    marginRight: SIZES.spacing.md,
  },
  headerTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: SIZES.spacing.xl,
  },
  logoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.spacing.md,
  },
  logoText: {
    fontSize: 32,
  },
  welcomeText: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    marginBottom: SIZES.spacing.xs,
  },
  subtitleText: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  registerButton: {
    marginBottom: SIZES.spacing.lg,
    marginTop: SIZES.spacing.md,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: SIZES.spacing.md,
    fontSize: SIZES.fontSize.sm,
  },
  socialButtons: {
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.lg,
  },
  socialButton: {
    width: "100%",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SIZES.spacing.md,
  },
  loginText: {
    fontSize: SIZES.fontSize.md,
  },
  loginLink: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
});
