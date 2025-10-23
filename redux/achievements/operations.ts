import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "../../hooks/showToast";
import { apiService } from "../../services/api";
import type { Achievement } from "../../types/achievements.types";

interface UserStatsResponse {
  knownWords: number;
  totalWords: number;
  knownPhrases: number;
  totalPhrases: number;
  completedExercises: number;
  totalExercises: number;
  completedGrammarTests: number;
  totalGrammarTests: number;
  totalPoints: number;
  streak: number;
  unlockedAchievements: number;
  totalAchievements: number;
}

interface CheckAchievementsResponse {
  success: boolean;
  newlyUnlocked: Achievement[];
  message: string;
}

export const fetchAchievements = createAsyncThunk(
  "achievements/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.request<Achievement[]>("/achievements");
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast.error({
          message: error.message || "Помилка завантаження досягнень",
        });
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Помилка завантаження досягнень");
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  "achievements/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.request<UserStatsResponse>(
        "/achievements/stats"
      );
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Помилка завантаження статистики");
    }
  }
);

export const checkAchievements = createAsyncThunk(
  "achievements/check",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.request<CheckAchievementsResponse>(
        "/achievements/check",
        {
          method: "POST",
        }
      );

      if (response.newlyUnlocked.length > 0) {
        showToast.success({
          message: `${response.message}`,
          duration: 3000,
        });
      }

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Помилка перевірки досягнень");
    }
  }
);
