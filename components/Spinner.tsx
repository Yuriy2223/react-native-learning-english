import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTheme } from "../hooks/useTheme";

interface SpinnerProps {
  size?: "small" | "large";
  text?: string;
  fullScreen?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "large",
  fullScreen = false,
}) => {
  const { colors } = useTheme();

  const content = (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} animating />
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={[
          styles.fullScreenContainer,
          { backgroundColor: colors.background },
        ]}
      >
        {content}
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
