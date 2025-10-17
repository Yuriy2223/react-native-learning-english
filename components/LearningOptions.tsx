import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface LearningOptionsProps {
  onStartLearning: () => void;
}

export const LearningOptions = ({ onStartLearning }: LearningOptionsProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.optionsContainer, { backgroundColor: colors.surface }]}
    >
      <Text style={[styles.optionsTitle, { color: colors.textPrimary }]}>
        Режими навчання фраз
      </Text>

      <View style={styles.optionsList}>
        <TouchableOpacity
          style={[styles.optionItem, { backgroundColor: colors.background }]}
          onPress={onStartLearning}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.optionIcon,
              { backgroundColor: colors.secondary + "20" },
            ]}
          >
            <Ionicons name="play" size={20} color={colors.secondary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>
              Вивчення нових фраз
            </Text>
            <Text
              style={[
                styles.optionDescription,
                { color: colors.textSecondary },
              ]}
            >
              Послідовно вивчайте корисні фрази з перекладом
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionItem,
            { backgroundColor: colors.background, opacity: 0.6 },
          ]}
          activeOpacity={0.7}
          disabled
        >
          <View
            style={[
              styles.optionIcon,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons name="refresh" size={20} color={colors.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>
              Повторення фраз
            </Text>
            <Text
              style={[
                styles.optionDescription,
                { color: colors.textSecondary },
              ]}
            >
              Повторіть вже вивчені фрази (незабаром)
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionItem,
            { backgroundColor: colors.background, opacity: 0.6 },
          ]}
          activeOpacity={0.7}
          disabled
        >
          <View
            style={[
              styles.optionIcon,
              { backgroundColor: colors.success + "20" },
            ]}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={20}
              color={colors.success}
            />
          </View>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>
              Діалогова практика
            </Text>
            <Text
              style={[
                styles.optionDescription,
                { color: colors.textSecondary },
              ]}
            >
              Практикуйте фрази в діалогах (незабаром)
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    marginHorizontal: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  optionsTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.md,
    textAlign: "center",
  },
  optionsList: {
    gap: SIZES.spacing.sm,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
    marginBottom: SIZES.spacing.xs,
  },
  optionDescription: {
    fontSize: SIZES.fontSize.sm,
    lineHeight: 18,
  },
});
