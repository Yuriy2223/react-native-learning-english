import Toast from "react-native-toast-message";

interface ToastOptions {
  title?: string;
  message: string;
  duration?: number;
}

export const showToast = {
  success: (options: ToastOptions) => {
    Toast.show({
      type: "success",
      text1: options.title || "Успіх",
      text2: options.message,
      visibilityTime: options.duration || 3000,
      position: "top",
    });
  },
  error: (options: ToastOptions) => {
    Toast.show({
      type: "error",
      text1: options.title || "Помилка",
      text2: options.message,
      visibilityTime: options.duration || 4000,
      position: "top",
    });
  },
  warning: (options: ToastOptions) => {
    Toast.show({
      type: "warning",
      text1: options.title || "Увага",
      text2: options.message,
      visibilityTime: options.duration || 3500,
      position: "top",
    });
  },
  info: (options: ToastOptions) => {
    Toast.show({
      type: "info",
      text1: options.title || "Інформація",
      text2: options.message,
      visibilityTime: options.duration || 3000,
      position: "top",
    });
  },
};
