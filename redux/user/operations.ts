import { showToast } from "@/hooks/showToast";
import { apiService } from "@/services/api";
import { User, UserProgress } from "@/types/user.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserProgress = createAsyncThunk<
  UserProgress,
  void,
  { rejectValue: string }
>("user/fetchProgress", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.request<UserProgress>("/users/progress");
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch progress:", error);
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Не вдалося завантажити прогрес");
  }
});

export const updateProgress = createAsyncThunk<
  UserProgress,
  Partial<UserProgress>,
  { rejectValue: string }
>("user/updateProgress", async (progressData, { rejectWithValue }) => {
  try {
    const response = await apiService.request<UserProgress>("/users/progress", {
      method: "PATCH",
      body: JSON.stringify(progressData),
    });

    showToast.success({
      message: "Прогрес успішно оновлено",
      duration: 2000,
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка оновлення прогресу",
      });
      return rejectWithValue(error.message);
    }

    showToast.error({ message: "Помилка оновлення прогресу" });
    return rejectWithValue("Помилка оновлення прогресу");
  }
});

export const updateProfile = createAsyncThunk<
  User,
  Partial<Pick<User, "name" | "email" | "avatar">>,
  { rejectValue: string }
>("auth/updateProfile", async (data, { rejectWithValue }) => {
  try {
    const response = await apiService.request<User>("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    await AsyncStorage.setItem("user_data", JSON.stringify(response));

    showToast.success({
      message: "Профіль успішно оновлено",
      duration: 3000,
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка оновлення профілю",
      });
      return rejectWithValue(error.message || "Помилка оновлення профілю");
    }
    showToast.error({ message: "Помилка оновлення профілю" });
    return rejectWithValue("Помилка оновлення профілю");
  }
});
