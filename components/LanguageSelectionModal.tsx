import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../constants";

interface LanguageSelectionModalProps {
  visible: boolean;
  colors: {
    surface: string;
    textPrimary: string;
    primary: string;
    border: string;
  };
  currentLanguage: string;
  onSelectLanguage: (language: "uk" | "en") => void;
  onClose: () => void;
}

export const LanguageSelectionModal = ({
  visible,
  colors,
  currentLanguage,
  onSelectLanguage,
  onClose,
}: LanguageSelectionModalProps) => {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
          Оберіть мову
        </Text>

        <TouchableOpacity
          style={[
            styles.languageOption,
            currentLanguage === "uk" && {
              backgroundColor: colors.primary + "20",
            },
          ]}
          onPress={() => onSelectLanguage("uk")}
        >
          <Text style={[styles.languageText, { color: colors.textPrimary }]}>
            🇺🇦 Українська
          </Text>
          {currentLanguage === "uk" && (
            <Ionicons name="checkmark" size={20} color={colors.primary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageOption,
            currentLanguage === "en" && {
              backgroundColor: colors.primary + "20",
            },
          ]}
          onPress={() => onSelectLanguage("en")}
        >
          <Text style={[styles.languageText, { color: colors.textPrimary }]}>
            🇺🇸 English
          </Text>
          {currentLanguage === "en" && (
            <Ionicons name="checkmark" size={20} color={colors.primary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modalCloseButton, { backgroundColor: colors.border }]}
          onPress={onClose}
        >
          <Text style={[styles.modalCloseText, { color: colors.textPrimary }]}>
            Скасувати
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.spacing.lg,
  },
  modalTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: SIZES.spacing.lg,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.spacing.sm,
  },
  languageText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
  },
  modalCloseButton: {
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    alignItems: "center",
    marginTop: SIZES.spacing.md,
  },
  modalCloseText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
  },
});
