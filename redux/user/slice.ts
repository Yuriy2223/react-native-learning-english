import { User, UserProgress } from "@/types/user.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../auth/operations";
import { setUser } from "../auth/slice";
import { fetchUserProgress, updateProfile, updateProgress } from "./operations";

interface UserState {
  user?: User;
  progress?: UserProgress;
  isLoading: boolean;
  isError?: string;
  studySession: {
    startTime?: number;
    isActive: boolean;
    currentSessionMinutes: number;
  };
}

const initialState: UserState = {
  progress: undefined,
  isLoading: false,
  isError: undefined,
  studySession: {
    startTime: undefined,
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
        state.studySession.startTime = undefined;
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
      state.isError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = action.payload;
        state.isError = undefined;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(updateProgress.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = action.payload;
        state.isError = undefined;
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isError = undefined;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(loginUser.fulfilled, (state) => {
        state.progress = undefined;
        state.isError = undefined;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.progress = undefined;
        state.isError = undefined;
      })
      .addCase(setUser, (state) => {
        state.progress = undefined;
        state.isError = undefined;
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
