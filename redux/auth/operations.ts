// redux/auth/operations.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";
import {
  ForgotPasswordFormData,
  SigninFormData,
  SignupFormData,
} from "../../types";
import { authUtils } from "../../utils";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: SigninFormData, { rejectWithValue }) => {
    try {
      const response = await apiService.login(data);

      await authUtils.saveAuthToken(response.accessToken);
      await authUtils.saveUserData(response.user);

      apiService.setAuthToken(response.accessToken);

      return response.user;
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.message?.includes("Email не підтверджено")) {
        return rejectWithValue({
          message: error.message,
          emailVerified: false,
          email: error.email,
        });
      }

      return rejectWithValue(error.message || "Помилка входу");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data: SignupFormData, { rejectWithValue }) => {
    try {
      const response = await apiService.register(data);

      console.log("✅ API Success: /api/auth/signup");
      console.log("📦 Response:", response);

      return {
        message: response.message,
        requiresVerification: true,
      };
    } catch (error: any) {
      console.error("Registration error:", error);
      return rejectWithValue(error.message || "Помилка реєстрації");
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = await authUtils.getAuthToken();

      if (!token) {
        console.log("No token found - user not authenticated");
        return null;
      }

      apiService.setAuthToken(token);
      const userData = await apiService.getUserProfile();

      await authUtils.saveUserData(userData);

      return userData;
    } catch (error: any) {
      console.log("Auth check error:", error.message);

      await authUtils.removeAuthToken();
      await authUtils.removeUserData();
      apiService.clearAuthToken();

      return null;
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: ForgotPasswordFormData, { rejectWithValue }) => {
    try {
      await apiService.forgotPassword(data.email);
      return { message: "Лист відправлено успішно" };
    } catch (error: any) {
      console.error("Forgot password error:", error);
      return rejectWithValue(error.message || "Помилка відправки листа");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authUtils.removeAuthToken();
      await authUtils.removeUserData();

      apiService.clearAuthToken();

      return null;
    } catch (error: any) {
      console.error("Logout error:", error);
      return rejectWithValue(error.message || "Помилка виходу");
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response = await apiService.googleAuth(idToken);

      await authUtils.saveAuthToken(response.accessToken);
      await authUtils.saveUserData(response.user);
      apiService.setAuthToken(response.accessToken);

      return response.user;
    } catch (error: any) {
      console.error("Google login error:", error);
      return rejectWithValue(error.message || "Помилка входу через Google");
    }
  }
);
