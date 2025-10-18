import { Ionicons } from "@expo/vector-icons";
import {
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface GrammarSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function GrammarSearchBar({
  value,
  onChangeText,
}: GrammarSearchBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
      <Ionicons name="search" size={20} color={colors.textSecondary} />
      <RNTextInput
        style={[styles.searchInput, { color: colors.textPrimary }]}
        placeholder="Пошук граматичних тем..."
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SIZES.spacing.lg,
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.md,
    gap: SIZES.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.fontSize.md,
    paddingVertical: SIZES.spacing.xs,
  },
});
