// app/(auth)/login.tsx
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
import { useAppDispatch } from "../../redux/store";
import { apiService } from "../../services/api";
import { LoginFormData } from "../../types";
import { authUtils } from "../../utils";
import { loginSchema } from "../../validation";
import { loginUser } from "../../redux/auth/operations";
import { setUser } from "../../redux/auth/slice";

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { showSuccess, showError, showInfo } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema) as Resolver<LoginFormData>,
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await dispatch(loginUser(data)).unwrap();

      showSuccess({
        message: "Успішний вхід в систему!",
      });

      router.replace("/home");
    } catch (error) {
      console.error("Login error:", error);
      showError({
        message: "Помилка входу. Перевірте дані.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { socialAuthService } = await import("../../services/socialAuth");
      const result = await socialAuthService.signInWithGoogle();

      if (result.type === "success" && result.user && result.token) {
        // Зберігаємо токен
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
          message: `Вітаємо, ${result.user.name}!`,
        });

        router.replace("/home");
      } else if (result.type === "cancel") {
        showInfo({
          message: "Авторизацію скасовано",
        });
      } else {
        showError({
          message: result.error || "Помилка входу через Google",
        });
      }
    } catch (error) {
      console.error("Google login error:", error);
      showError({
        message: "Помилка входу через Google",
      });
    }
  };

  const handleAppleLogin = async () => {
    try {
      const { socialAuthService } = await import("../../services/socialAuth");

      if (!socialAuthService.isAppleAvailable()) {
        showError({
          message: "Apple Sign In доступний тільки на iOS",
        });
        return;
      }

      const result = await socialAuthService.signInWithApple();

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
          message: `Вітаємо, ${result.user.name}! Ви увійшли через Apple ID`,
        });

        router.replace("/home");
      } else if (result.type === "cancel") {
        showInfo({
          message: "Авторизацію скасовано",
        });
      } else {
        showError({
          message: result.error || "Помилка входу через Apple ID",
        });
      }
    } catch (error) {
      console.error("Apple login error:", error);
      showError({
        message: "Помилка входу через Apple ID",
      });
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View
          style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.logoText}>🎓</Text>
        </View>
        <Text style={[styles.appTitle, { color: colors.text }]}>
          English Learning
        </Text>
        <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
          Вивчайте англійську легко та весело
        </Text>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={[styles.formTitle, { color: colors.text }]}>
          Вхід в акаунт
        </Text>

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
              placeholder="Введіть ваш пароль"
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

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => router.push("/(auth)/forgot-password")}
        >
          <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
            Забули пароль?
          </Text>
        </TouchableOpacity>

        <Button
          title="Увійти"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={!isValid}
          style={styles.loginButton}
        />

        {/* Social Login */}
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
            або
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.socialButtons}>
          <Button
            title="Увійти через Google"
            onPress={handleGoogleLogin}
            variant="outline"
            style={styles.socialButton}
          />

          <Button
            title="Увійти через Apple"
            onPress={handleAppleLogin}
            variant="outline"
            style={styles.socialButton}
          />
        </View>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, { color: colors.textSecondary }]}>
            Немає акаунту?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={[styles.registerLink, { color: colors.primary }]}>
              Створити акаунт
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
    justifyContent: "center",
    padding: SIZES.spacing.lg,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: SIZES.spacing.xxl,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.spacing.md,
  },
  logoText: {
    fontSize: 40,
  },
  appTitle: {
    fontSize: SIZES.fontSize.xxl,
    fontWeight: "bold",
    marginBottom: SIZES.spacing.xs,
  },
  appSubtitle: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  formTitle: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    marginBottom: SIZES.spacing.lg,
    textAlign: "center",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: SIZES.spacing.lg,
  },
  forgotPasswordText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: "500",
  },
  loginButton: {
    marginBottom: SIZES.spacing.lg,
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
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: SIZES.fontSize.md,
  },
  registerLink: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
});
