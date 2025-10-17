import { showToast } from "@/hooks/showToast";
import { apiService } from "@/services/api";
import {
  GoogleAuthResponse,
  SigninFormData,
  SigninResponse,
  SignupFormData,
  SignupResponse,
} from "@/types/auth.type";
import { User } from "@/types/user.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk<
  User,
  SigninFormData,
  {
    rejectValue:
      | string
      | { message: string; emailVerified: boolean; email?: string };
  }
>("auth/loginUser", async (data, { rejectWithValue }) => {
  try {
    const response = await apiService.request<SigninResponse>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    });

    await AsyncStorage.setItem("user_token", response.accessToken);
    await AsyncStorage.setItem("user_data", JSON.stringify(response.user));
    apiService.setAuthToken(response.accessToken);

    showToast.success({ message: "Успішний вхід в систему!" });
    return response.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      const apiError = error as Error & {
        emailVerified?: boolean;
        email?: string;
      };

      if (apiError.message?.includes("Email не підтверджено")) {
        showToast.warning({
          title: "Email не підтверджено",
          message: "Підтвердіть вашу електронну пошту перед входом",
          duration: 5000,
        });
        return rejectWithValue({
          message: apiError.message,
          emailVerified: false,
          email: apiError.email,
        });
      }
      showToast.error({ message: apiError.message || "Помилка входу" });
      return rejectWithValue(apiError.message || "Помилка входу");
    }
    showToast.error({ message: "Помилка входу" });
    return rejectWithValue("Помилка входу");
  }
});

export const registerUser = createAsyncThunk<
  { message: string; requiresVerification: boolean },
  SignupFormData,
  { rejectValue: string }
>("auth/registerUser", async (data, { rejectWithValue }) => {
  try {
    const response = await apiService.request<SignupResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });

    showToast.info({
      message:
        response.message || "Перевірте вашу пошту для підтвердження акаунту",
    });

    return {
      message: response.message,
      requiresVerification: true,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({ message: error.message || "Помилка реєстрації" });

      return rejectWithValue(error.message || "Помилка реєстрації");
    }
    showToast.error({ message: "Помилка реєстрації" });
    return rejectWithValue("Помилка реєстрації");
  }
});

export const checkAuthStatus = createAsyncThunk<User | undefined>(
  "auth/checkAuthStatus",
  async () => {
    try {
      const token = await AsyncStorage.getItem("user_token");

      if (!token) {
        return undefined;
      }

      apiService.setAuthToken(token);
      const userData = await apiService.request<User>("/users/me");

      try {
        await AsyncStorage.setItem("user_data", JSON.stringify(userData));
      } catch (storageError) {
        console.error("Failed to save user data:", storageError);
      }

      return userData;
    } catch (error: unknown) {
      console.error("Auth check failed:", error);

      try {
        await AsyncStorage.removeItem("user_token");
        await AsyncStorage.removeItem("user_data");
      } catch (storageError) {
        console.error("Failed to clear storage:", storageError);
      }

      apiService.clearAuthToken();

      return undefined;
    }
  }
);

export const forgotPassword = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    await apiService.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    showToast.success({
      message: "Лист з інструкціями відправлено на вашу пошту!",
      duration: 3000,
    });

    return { message: "Лист відправлено успішно" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка відправки листа",
      });

      return rejectWithValue(error.message || "Помилка відправки листа");
    }
    showToast.error({ message: "Помилка відправки листа" });
    return rejectWithValue("Помилка відправки листа");
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      try {
        await apiService.request("/auth/logout", { method: "POST" });
      } catch (apiError) {
        console.error("Logout API call failed:", apiError);
      }

      try {
        await AsyncStorage.removeItem("user_token");
        await AsyncStorage.removeItem("user_data");
      } catch (storageError) {
        console.error("Failed to clear storage:", storageError);
      }

      apiService.clearAuthToken();

      showToast.success({ message: "Ви успішно вийшли з системи" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast.error({ message: error.message || "Помилка виходу" });
        return rejectWithValue(error.message || "Помилка виходу");
      }
      showToast.error({ message: "Помилка виходу" });
      return rejectWithValue("Помилка виходу");
    }
  }
);

export const googleLogin = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("auth/googleLogin", async (idToken, { rejectWithValue }) => {
  try {
    const response = await apiService.request<GoogleAuthResponse>(
      "/auth/google",
      {
        method: "POST",
        body: JSON.stringify({ idToken }),
      }
    );

    try {
      await AsyncStorage.setItem("user_token", response.accessToken);
      await AsyncStorage.setItem("user_data", JSON.stringify(response.user));
    } catch (storageError) {
      console.error("Failed to save auth data:", storageError);
    }

    apiService.setAuthToken(response.accessToken);
    showToast.success({ message: "Успішний вхід через Google!" });
    return response.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка входу через Google",
      });
      return rejectWithValue(error.message || "Помилка входу через Google");
    }
    showToast.error({ message: "Помилка входу через Google" });
    return rejectWithValue("Помилка входу через Google");
  }
});

export const resendVerification = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>("auth/resendVerification", async (email, { rejectWithValue }) => {
  try {
    await apiService.request("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    showToast.success({
      message: "Лист підтвердження відправлено повторно",
      duration: 4000,
    });

    return { message: "Лист підтвердження відправлено повторно" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка відправки листа",
      });
      return rejectWithValue(error.message || "Помилка відправки листа");
    }
    showToast.error({ message: "Помилка відправки листа" });
    return rejectWithValue("Помилка відправки листа");
  }
});

export const resetPassword = createAsyncThunk<
  { message: string },
  { email: string; token: string; newPassword: string },
  { rejectValue: string }
>("auth/resetPassword", async (data, { rejectWithValue }) => {
  try {
    await apiService.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });

    showToast.success({
      message: "Пароль успішно змінено!",
      duration: 3000,
    });
    return { message: "Пароль успішно змінено" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка скидання пароля",
      });
      return rejectWithValue(error.message || "Помилка скидання пароля");
    }
    showToast.error({ message: "Помилка скидання пароля" });
    return rejectWithValue("Помилка скидання пароля");
  }
});
