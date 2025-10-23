import { createSlice } from "@reduxjs/toolkit";
import type { Achievement } from "../../types/achievements.types";
import {
  checkAchievements,
  fetchAchievements,
  fetchUserStats,
} from "./operations";

interface UserStats {
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

export interface AchievementsState {
  achievements: Achievement[];
  userStats?: UserStats;
  isLoading: boolean;
  error?: string;
}

const initialState: AchievementsState = {
  achievements: [],
  userStats: undefined,
  isLoading: false,
  error: undefined,
};

const achievementsSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.achievements = action.payload;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.userStats = action.payload;
      })
      .addCase(checkAchievements.fulfilled, (state, action) => {
        if (action.payload.newlyUnlocked.length > 0) {
          state.achievements = state.achievements.map((achievement) => {
            const unlocked = action.payload.newlyUnlocked.find(
              (a: Achievement) => a.id === achievement.id
            );
            return unlocked
              ? {
                  ...achievement,
                  isUnlocked: true,
                  unlockedAt: unlocked.unlockedAt,
                }
              : achievement;
          });
        }
      });
  },
});

export const { clearError } = achievementsSlice.actions;
export const achievementsReducer = achievementsSlice.reducer;
