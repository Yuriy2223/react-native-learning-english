import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProgress } from "../../types";
import { loginUser, registerUser } from "../auth/operations";
import { setUser } from "../auth/slice";
import { fetchUserProgress, updateProgress } from "./operations";

interface UserState {
  progress: UserProgress | null;
  isLoading: boolean;
  isError: string | null;
  studySession: {
    startTime: number | null;
    isActive: boolean;
    currentSessionMinutes: number;
  };
}

const initialState: UserState = {
  progress: null,
  isLoading: false,
  isError: null,
  studySession: {
    startTime: null,
    isActive: false,
    currentSessionMinutes: 0,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startStudySession: (state) => {
      state.studySession.startTime = Date.now();
      state.studySession.isActive = true;
      state.studySession.currentSessionMinutes = 0;
    },

    endStudySession: (state) => {
      if (state.studySession.startTime && state.studySession.isActive) {
        const sessionDuration = Math.floor(
          (Date.now() - state.studySession.startTime) / 60000
        );
        state.studySession.currentSessionMinutes += sessionDuration;
        state.studySession.isActive = false;
        state.studySession.startTime = null;
      }
    },

    updateSessionTime: (state) => {
      if (state.studySession.startTime && state.studySession.isActive) {
        state.studySession.currentSessionMinutes = Math.floor(
          (Date.now() - state.studySession.startTime) / 60000
        );
      }
    },

    incrementKnownWords: (state) => {
      if (state.progress) {
        state.progress.knownWords += 1;
      }
    },

    incrementKnownPhrases: (state) => {
      if (state.progress) {
        state.progress.knownPhrases += 1;
      }
    },

    updateStreak: (state, action: PayloadAction<number>) => {
      if (state.progress) {
        state.progress.streak = action.payload;
      }
    },

    addPoints: (state, action: PayloadAction<number>) => {
      if (state.progress) {
        state.progress.totalPoints += action.payload;
      }
    },

    clearError: (state) => {
      state.isError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = action.payload;
        state.isError = null;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload as string;
      });

    builder
      .addCase(updateProgress.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = action.payload;
        state.isError = null;
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload as string;
      });

    builder
      .addCase(loginUser.fulfilled, (state) => {
        state.progress = null;
        state.isError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.progress = null;
        state.isError = null;
      })
      .addCase(setUser, (state) => {
        state.progress = null;
        state.isError = null;
      });
  },
});

export const {
  startStudySession,
  endStudySession,
  updateSessionTime,
  incrementKnownWords,
  incrementKnownPhrases,
  updateStreak,
  addPoints,
  clearError,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
