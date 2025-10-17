import { Logo } from "@/components/Logo";
import { SigninFormData } from "@/types/auth.type";
import { navigate, replace } from "@/utils";
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
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useTheme } from "../../hooks/useTheme";
import { loginUser } from "../../redux/auth/operations";
import { useAppDispatch } from "../../redux/store";
import { loginSchema } from "../../validation";

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    signInWithGoogle,
    isLoading: isGoogleLoading,
    isReady: isGoogleReady,
  } = useGoogleAuth({
    successMessage: "Успішний вхід через Google!",
    redirectTo: "/home",
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SigninFormData>({
    resolver: yupResolver(loginSchema) as Resolver<SigninFormData>,
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SigninFormData) => {
    setIsLoading(true);
    try {
      await dispatch(loginUser(data)).unwrap();
      replace("/home");
    } catch (err: unknown) {
      const error = err as {
        message?: string;
        emailVerified?: boolean;
        email?: string;
      };

      if (error?.emailVerified === false) {
        navigate("/(auth)/verify-email", {
          email: error.email || data.email,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Logo />

      <View style={styles.formContainer}>
        <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
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
            onPress={signInWithGoogle}
            variant="outline"
            style={styles.socialButton}
            disabled={!isGoogleReady}
            loading={isGoogleLoading}
          />
        </View>

        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, { color: colors.textSecondary }]}>
            Немає акаунту?
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
    gap: 10,
  },
  registerText: {
    fontSize: SIZES.fontSize.md,
  },
  registerLink: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
});
