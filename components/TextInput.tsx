// components/TextInput.tsx
import React, { forwardRef } from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ label, error, leftIcon, rightIcon, style, ...props }, ref) => {
    const { colors } = useTheme();

    const inputStyles = [
      styles.input,
      {
        backgroundColor: colors.surface,
        borderColor: error ? colors.error : colors.border,
        color: colors.text,
      },
      style,
    ];

    const placeholderColor = colors.textSecondary;

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        )}

        <View style={styles.inputContainer}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <RNTextInput
            ref={ref}
            style={[
              inputStyles,
              leftIcon ? styles.inputWithLeftIcon : undefined,
              rightIcon ? styles.inputWithRightIcon : undefined,
            ]}
            placeholderTextColor={placeholderColor}
            {...props}
          />

          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>

        {error && (
          <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
        )}
      </View>
    );
  }
);

TextInput.displayName = "TextInput";

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacing.md,
  },
  label: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: "500",
    marginBottom: SIZES.spacing.xs,
  },
  inputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: SIZES.borderRadius.md,
    paddingHorizontal: SIZES.spacing.md,
    fontSize: SIZES.fontSize.md,
  },
  inputWithLeftIcon: {
    paddingLeft: 40,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  leftIcon: {
    position: "absolute",
    left: SIZES.spacing.md,
    zIndex: 1,
  },
  rightIcon: {
    position: "absolute",
    right: SIZES.spacing.md,
    zIndex: 1,
  },
  error: {
    fontSize: SIZES.fontSize.xs,
    marginTop: SIZES.spacing.xs,
  },
});
