import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  View,
} from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface LoaderProps {
  size?: "small" | "large";
  text?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "large",
  text = "Завантаження",
  fullScreen = false,
}) => {
  const { colors } = useTheme();
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const createAnimation = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );

    const anim1 = createAnimation(dot1, 100);
    const anim2 = createAnimation(dot2, 125);
    const anim3 = createAnimation(dot3, 150);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [dot1, dot2, dot3, pulse]);

  const Dot = ({ animatedValue }: { animatedValue: Animated.Value }) => (
    <Animated.Text
      style={{
        opacity: animatedValue,
        color: colors.textPrimary,
        fontSize: SIZES.fontSize.lg,
        fontWeight: "600",
      }}
    >
      .
    </Animated.Text>
  );

  const content = (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} animating />
      <View style={styles.textRow}>
        <Animated.Text
          style={[
            styles.text,
            {
              color: colors.textPrimary,
              opacity: pulse,
            },
          ]}
        >
          {text}
        </Animated.Text>
        <View style={styles.dots}>
          <Dot animatedValue={dot1} />
          <Dot animatedValue={dot2} />
          <Dot animatedValue={dot3} />
        </View>
      </View>
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
  textRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SIZES.spacing.lg,
  },
  text: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
  dots: {
    flexDirection: "row",
    marginLeft: 6,
    gap: 3,
  },
});
