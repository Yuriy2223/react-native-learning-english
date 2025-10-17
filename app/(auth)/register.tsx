import { Logo } from "@/components/Logo";
import { SignupFormData } from "@/types/auth.type";
import { goBack, navigate } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { registerUser } from "../../redux/auth/operations";
import { useAppDispatch } from "../../redux/store";
import { registerSchema } from "../../validation";

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    signInWithGoogle,
    isLoading: isGoogleLoading,
    isReady: isGoogleReady,
  } = useGoogleAuth({
    successMessage: "Акаунт Google успішно створено!",
    redirectTo: "/home",
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: yupResolver(registerSchema) as Resolver<SignupFormData>,
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await dispatch(registerUser(data)).unwrap();
      navigate("/(auth)/verify-email", { email: data.email });
    } catch (error: any) {
      console.error("Помилка реєстрації:", error);
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
          Створити акаунт
        </Text>
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
            onPress={signInWithGoogle}
            variant="outline"
            style={styles.socialButton}
            disabled={!isGoogleReady}
            loading={isGoogleLoading}
          />
        </View>

        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>
            Вже маєте акаунт?
          </Text>
          <TouchableOpacity onPress={goBack}>
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
    justifyContent: "center",
    padding: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.xxl + 20,
  },
  formTitle: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    marginBottom: SIZES.spacing.lg,
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
    gap: 10,
  },
  loginText: {
    fontSize: SIZES.fontSize.md,
  },
  loginLink: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
});
