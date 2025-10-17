import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../constants";

interface ResetSettingsModalProps {
  visible: boolean;
  colors: {
    surface: string;
    error: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetSettingsModal = ({
  visible,
  colors,
  isLoading,
  onConfirm,
  onCancel,
}: ResetSettingsModalProps) => {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
        <View style={styles.modalHeader}>
          <Ionicons name="warning" size={48} color={colors.error} />
        </View>

        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
          Скинути налаштування?
        </Text>

        <Text style={[styles.modalText, { color: colors.textSecondary }]}>
          Всі налаштування будуть скинуті.
        </Text>

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: colors.border }]}
            onPress={onCancel}
            disabled={isLoading}
          >
            <Text
              style={[styles.modalButtonText, { color: colors.textPrimary }]}
            >
              Скасувати
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: colors.error }]}
            onPress={onConfirm}
            disabled={isLoading}
          >
            <Text style={[styles.modalButtonText, { color: "#FFFFFF" }]}>
              {isLoading ? "Скидання..." : "Скинути"}
            </Text>
          </TouchableOpacity>
        </View>
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
    width: "85%",
    borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.spacing.xl,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: SIZES.spacing.md,
  },
  modalTitle: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: SIZES.spacing.md,
  },
  modalText: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
    marginBottom: SIZES.spacing.xl,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: SIZES.spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
  },
});
