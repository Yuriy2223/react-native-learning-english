import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { Button } from "./Button";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: "primary" | "danger";
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = "Підтвердити",
  cancelText = "Скасувати",
  confirmButtonVariant = "primary",
  icon = "alert-circle",
  iconColor,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const { colors } = useTheme();

  const getConfirmButtonStyle = () => {
    if (confirmButtonVariant === "danger") {
      return {
        backgroundColor: colors.error,
      };
    }
    return {
      backgroundColor: colors.primary,
    };
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={[styles.modalContainer, { backgroundColor: colors.surface }]}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: (iconColor || colors.error) + "20",
                },
              ]}
            >
              <Ionicons
                name={icon}
                size={32}
                color={iconColor || colors.error}
              />
            </View>

            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {title}
            </Text>

            <Text style={[styles.message, { color: colors.textSecondary }]}>
              {message}
            </Text>

            <View style={styles.buttonsContainer}>
              <Button
                title={cancelText}
                onPress={onCancel}
                variant="outline"
                style={styles.button}
              />
              <Button
                title={confirmText}
                onPress={() => {
                  onConfirm();
                  onCancel();
                }}
                style={[styles.button, getConfirmButtonStyle()]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.spacing.lg,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    borderRadius: SIZES.borderRadius.xl,
    padding: SIZES.spacing.xl,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.spacing.lg,
  },
  title: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: SIZES.spacing.md,
  },
  message: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SIZES.spacing.xl,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: SIZES.spacing.md,
    width: "100%",
  },
  button: {
    flex: 1,
  },
});
