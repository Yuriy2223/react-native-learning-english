import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";
import { UserProgress } from "../../types";

export const fetchUserProgress = createAsyncThunk(
  "user/fetchProgress",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserProgress();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch progress");
    }
  }
);

export const updateProgress = createAsyncThunk(
  "user/updateProgress",
  async (progressData: Partial<UserProgress>, { rejectWithValue }) => {
    try {
      const response = await apiService.updateUserProgress(progressData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update progress");
    }
  }
);
