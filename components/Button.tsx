// components/Button.tsx
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = "left",
}) => {
  const { colors } = useTheme();

  const buttonStyles = [
    styles.button,
    styles[size],
    variant === "primary" && {
      backgroundColor: colors.primary,
    },
    variant === "secondary" && {
      backgroundColor: colors.secondary,
    },
    variant === "outline" && {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.primary,
    },
    (disabled || loading) && {
      opacity: 0.6,
    },
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    variant === "primary" && {
      color: "#FFFFFF",
    },
    variant === "secondary" && {
      color: "#FFFFFF",
    },
    variant === "outline" && {
      color: colors.primary,
    },
    textStyle,
  ];

  const iconSpacing = size === "small" ? SIZES.spacing.xs : SIZES.spacing.sm;

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? colors.primary : "#FFFFFF"}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === "left" && (
            <View style={[styles.iconContainer, { marginRight: iconSpacing }]}>
              {icon}
            </View>
          )}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === "right" && (
            <View style={[styles.iconContainer, { marginLeft: iconSpacing }]}>
              {icon}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  small: {
    paddingVertical: SIZES.spacing.xs,
    paddingHorizontal: SIZES.spacing.sm,
    minHeight: 32,
  },
  medium: {
    paddingVertical: SIZES.spacing.sm,
    paddingHorizontal: SIZES.spacing.md,
    minHeight: 48,
  },
  large: {
    paddingVertical: SIZES.spacing.md,
    paddingHorizontal: SIZES.spacing.lg,
    minHeight: 56,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  smallText: {
    fontSize: SIZES.fontSize.sm,
  },
  mediumText: {
    fontSize: SIZES.fontSize.md,
  },
  largeText: {
    fontSize: SIZES.fontSize.lg,
  },
});
