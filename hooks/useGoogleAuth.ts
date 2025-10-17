// import { useState } from "react";
// import { showToast } from "../hooks/showToast";
// import { setUser } from "../redux/auth/slice";
// import { useAppDispatch } from "../redux/store";
// import { apiService } from "../services/api";
// import { googleAuthService } from "../services/googleAuth";
// import { replace } from "../utils";

// // // Auth utilities
// // export const authUtils = {
// //   async saveAuthToken(token: string): Promise<void> {
// //     await storage.setItem(STORAGE_KEYS.USER_TOKEN, token);
// //   },

// //   async getAuthToken(): Promise<string | null> {
// //     return await storage.getItem(STORAGE_KEYS.USER_TOKEN);
// //   },

// //   async removeAuthToken(): Promise<void> {
// //     await storage.removeItem(STORAGE_KEYS.USER_TOKEN);
// //   },

// //   async saveUserData(userData: any): Promise<void> {
// //     await storage.setItem(STORAGE_KEYS.USER_DATA, userData);
// //   },

// //   async getUserData(): Promise<any> {
// //     return await storage.getItem(STORAGE_KEYS.USER_DATA);
// //   },

// //   async removeUserData(): Promise<void> {
// //     await storage.removeItem(STORAGE_KEYS.USER_DATA);
// //   },
// // };

// interface UseGoogleAuthOptions {
//   onSuccess?: () => void;
//   successMessage?: string;
//   redirectTo?: string;
// }

// export const useGoogleAuth = (options?: UseGoogleAuthOptions) => {
//   const dispatch = useAppDispatch();
//   const [isLoading, setIsLoading] = useState(false);

//   const signInWithGoogle = async () => {
//     if (!googleAuthService.isAvailable()) {
//       showToast.error({
//         message: "Google Sign-In не налаштований. Перевірте конфігурацію.",
//       });
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const idToken = await googleAuthService.signIn();
//       const apiResponse = await apiService.googleAuth(idToken);

//       await authUtils.saveAuthToken(apiResponse.accessToken);
//       apiService.setAuthToken(apiResponse.accessToken);
//       await authUtils.saveUserData(apiResponse.user);

//       dispatch(setUser(apiResponse.user));

//       showToast.success({
//         message:
//           options?.successMessage || `Вітаємо, ${apiResponse.user.name}!`,
//       });

//       if (options?.onSuccess) {
//         options.onSuccess();
//       }

//       replace(options?.redirectTo || "/home");
//     } catch (error: any) {
//       showToast.error({
//         message: error.message || "Помилка авторизації через Google",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     signInWithGoogle,
//     isLoading,
//     isReady: googleAuthService.isAvailable(),
//   };
// };
import { GoogleAuthResponse } from "@/types/auth.type";
import { useState } from "react";
import { showToast } from "../hooks/showToast";
import { setUser } from "../redux/auth/slice";
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
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Помилка авторизації через Google"
        );
      }

      const data = (await response.json()) as GoogleAuthResponse;
      dispatch(setUser(data.user));
      showToast.success({
        message: options?.successMessage || `Вітаємо, ${data.user.name}!`,
      });

      if (options?.onSuccess) {
        options.onSuccess();
      }

      replace(options?.redirectTo || "/home");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Помилка авторизації через Google";

      showToast.error({ message });
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
