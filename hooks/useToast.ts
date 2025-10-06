// hooks/useToast.ts
import { useCallback } from "react";
import Toast from "react-native-toast-message";
import { TOAST_TYPES } from "../constants";

interface ToastOptions {
  title?: string;
  message: string;
  duration?: number;
}

export const useToast = () => {
  const showSuccess = useCallback((options: ToastOptions) => {
    Toast.show({
      type: TOAST_TYPES.SUCCESS,
      text1: options.title || "Успіх",
      text2: options.message,
      visibilityTime: options.duration || 3000,
      position: "top",
    });
  }, []);

  const showError = useCallback((options: ToastOptions) => {
    Toast.show({
      type: TOAST_TYPES.ERROR,
      text1: options.title || "Помилка",
      text2: options.message,
      visibilityTime: options.duration || 4000,
      position: "top",
    });
  }, []);

  const showWarning = useCallback((options: ToastOptions) => {
    Toast.show({
      type: TOAST_TYPES.WARNING,
      text1: options.title || "Увага",
      text2: options.message,
      visibilityTime: options.duration || 3500,
      position: "top",
    });
  }, []);

  const showInfo = useCallback((options: ToastOptions) => {
    Toast.show({
      type: TOAST_TYPES.INFO,
      text1: options.title || "Інформація",
      text2: options.message,
      visibilityTime: options.duration || 3000,
      position: "top",
    });
  }, []);

  const hide = useCallback(() => {
    Toast.hide();
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hide,
  };
};
