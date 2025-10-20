import { showToast } from "../../hooks/showToast";
import { apiService, STORAGE_KEYS } from "../../services/api";

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

async function saveAuthData(
  response: SigninResponse | GoogleAuthResponse
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
  apiService.setAuthToken(response.accessToken);

  if (response.refreshToken) {
    await AsyncStorage.setItem(
      STORAGE_KEYS.REFRESH_TOKEN,
      response.refreshToken
    );
    apiService.setRefreshToken(response.refreshToken);
  } else {
    console.warn("No refresh token in response, using only access token");
  }
}

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

    await saveAuthData(response);

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
      const [accessToken, refreshToken] = await AsyncStorage.multiGet([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
      ]);

      const token = accessToken[1];
      const refresh = refreshToken[1];

      if (!token) {
        return undefined;
      }

      apiService.setAuthToken(token);
      if (refresh) {
        apiService.setRefreshToken(refresh);
      }

      const userData = await apiService.request<User>("/users/me");

      return userData;
    } catch (error: unknown) {
      console.error("Auth check failed:", error);

      await apiService.logout();

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
        console.warn("Logout API call failed:", apiError);
      }

      await apiService.logout();

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

    await saveAuthData(response);

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
