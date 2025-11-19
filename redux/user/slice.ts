import { User, UserProgress } from "@/types/user.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  checkAuthStatus,
  googleLogin,
  loginUser,
  logoutUser,
  registerUser,
} from "../auth/operations";
import {
  checkAndUpdateStreak,
  fetchUserProgress,
  refreshUserStats,
  updateProfile,
  updateProgress,
  updateStudyTime,
} from "./operations";

interface UserState {
  user?: User;
  progress?: UserProgress;
  isLoading: boolean;
  isProgressLoading: boolean;
  isError?: string;
  studySession: {
    startTime?: number;
    isActive: boolean;
    currentSessionMinutes: number;
  };
}

const initialState: UserState = {
  user: undefined,
  progress: undefined,
  isLoading: false,
  isProgressLoading: false,
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

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    clearError: (state) => {
      state.isError = undefined;
    },

    clearUser: (state) => {
      state.user = undefined;
      state.progress = undefined;
      state.isError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.isProgressLoading = true;
        state.isError = undefined;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.isProgressLoading = false;
        state.progress = action.payload;
        state.isError = undefined;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isProgressLoading = false;
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

    builder.addCase(updateStudyTime.fulfilled, (state, action) => {
      if (state.user) {
        state.user.totalStudySeconds = action.payload;
      }
    });

    builder.addCase(refreshUserStats.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    builder
      .addCase(checkAndUpdateStreak.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAndUpdateStreak.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = action.payload;
      })
      .addCase(checkAndUpdateStreak.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.progress = undefined;
        state.isError = undefined;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.progress = undefined;
        state.isError = undefined;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
        } else {
          state.user = undefined;
          state.progress = undefined;
        }
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = undefined;
        state.progress = undefined;
        state.isError = undefined;
      })
      .addCase(registerUser.fulfilled, (state) => {
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
  updateUser,
  setUser,
  clearError,
  clearUser,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
