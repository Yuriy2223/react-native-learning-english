import { ProfileFormData } from "@/types/user.types";
import { Ionicons } from "@expo/vector-icons";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

interface ProfileFormProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  isDirty: boolean;
  isLoading: boolean;
  onSubmit: () => void;
}

export function ProfileForm({
  control,
  errors,
  isDirty,
  isLoading,
  onSubmit,
}: ProfileFormProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Редагування профілю
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

      <Button
        title="Зберегти зміни"
        onPress={onSubmit}
        loading={isLoading}
        disabled={!isDirty}
        style={styles.saveButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  title: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.lg,
    textAlign: "center",
  },
  saveButton: {
    marginTop: SIZES.spacing.md,
  },
});
