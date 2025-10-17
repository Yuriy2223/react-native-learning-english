import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showTitle?: boolean;
}

export function Logo({ size = "large", showTitle = true }: LogoProps) {
  const { colors } = useTheme();

  const sizeConfig = {
    small: {
      container: 50,
      radius: 25,
      emoji: 25,
      title: SIZES.fontSize.lg,
      marginBottom: SIZES.spacing.sm,
    },
    medium: {
      container: 70,
      radius: 35,
      emoji: 35,
      title: SIZES.fontSize.xl,
      marginBottom: SIZES.spacing.md,
    },
    large: {
      container: 120,
      radius: 60,
      emoji: 60,
      title: SIZES.fontSize.xxl,
      marginBottom: SIZES.spacing.xxl,
    },
  };

  const config = sizeConfig[size];

  return (
    <View style={[styles.container, { marginBottom: config.marginBottom }]}>
      <View
        style={[
          styles.logoPlaceholder,
          {
            backgroundColor: colors.primary,
            width: config.container,
            height: config.container,
            borderRadius: config.radius,
            marginBottom: showTitle ? SIZES.spacing.md : 0,
          },
        ]}
      >
        <Text style={[styles.logoText, { fontSize: config.emoji }]}>🎓</Text>
      </View>
      {showTitle && (
        <Text
          style={[
            styles.appTitle,
            { color: colors.textPrimary, fontSize: config.title },
          ]}
        >
          English Learning
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  logoPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 40,
  },
  appTitle: {
    fontWeight: "bold",
  },
});
