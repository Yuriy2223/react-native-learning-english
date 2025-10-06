import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";
import {
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
} from "../../types";
import { authUtils } from "../../utils";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await apiService.login(data);
      await authUtils.saveAuthToken(response.token);
      await authUtils.saveUserData(response.user);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data: RegisterFormData, { rejectWithValue }) => {
    try {
      const response = await apiService.register(data);
      await authUtils.saveAuthToken(response.token);
      await authUtils.saveUserData(response.user);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = await authUtils.getAuthToken();
      if (!token) {
        throw new Error("No token found");
      }
      const userData = await authUtils.getUserData();
      if (!userData) {
        throw new Error("No user data found");
      }
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: ForgotPasswordFormData, { rejectWithValue }) => {
    try {
      await apiService.forgotPassword(data.email);
      return { message: "Reset email sent successfully" };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to send reset email");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authUtils.removeAuthToken();
      await authUtils.removeUserData();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);
