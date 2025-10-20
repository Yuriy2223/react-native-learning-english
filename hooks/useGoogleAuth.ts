import { useState } from "react";
import { showToast } from "../hooks/showToast";
import { googleLogin } from "../redux/auth/operations";
import { useAppDispatch } from "../redux/store";
import { googleAuthService } from "../services/googleAuth";
import { replace } from "../utils";

interface UseGoogleAuthOptions {
  onSuccess?: () => void;
  successMessage?: string;
  redirectTo?: string;
}

export const useGoogleAuth = (options?: UseGoogleAuthOptions) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    if (!googleAuthService.isAvailable()) {
      showToast.error({
        message: "Google Sign-In не налаштований. Перевірте конфігурацію.",
      });
      return;
    }

    try {
      setIsLoading(true);

      const idToken = await googleAuthService.signIn();
      await dispatch(googleLogin(idToken)).unwrap();

      if (options?.successMessage) {
        showToast.success({
          message: options.successMessage,
        });
      }

      if (options?.onSuccess) {
        options.onSuccess();
      }

      replace(options?.redirectTo || "/home");
    } catch (error: unknown) {
      console.error("Google auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading,
    isReady: googleAuthService.isAvailable(),
  };
};
