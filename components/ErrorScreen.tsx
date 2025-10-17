import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { Button } from "./Button";

interface ErrorScreenProps {
  onRetry?: () => void;
  message?: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  onRetry,
  message = "Щось пішло не так",
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Ionicons name="alert-circle-outline" size={80} color={colors.error} />

      <Text style={[styles.title, { color: colors.textPrimary }]}>Помилка</Text>

      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>

      {onRetry && (
        <Button
          title="Спробувати знову"
          onPress={onRetry}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.xl,
  },
  title: {
    fontSize: SIZES.fontSize.xxl,
    fontWeight: "bold",
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
  message: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
    marginBottom: SIZES.spacing.xl,
    lineHeight: SIZES.fontSize.md * 1.5,
  },
  button: {
    minWidth: 200,
  },
});
