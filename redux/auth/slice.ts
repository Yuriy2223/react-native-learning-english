import { User } from "@/types/user.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  checkAuthStatus,
  forgotPassword,
  googleLogin,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from "./operations";

export interface AuthState {
  user?: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError?: string;
  registrationMessage?: string;
  emailToVerify?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.isError = undefined;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isError = undefined;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = undefined;

        if (typeof action.payload === "string") {
          state.isError = action.payload;
        } else if (action.payload && typeof action.payload === "object") {
          state.isError = action.payload.message;
        } else {
          state.isError = "Помилка входу";
        }
      });

    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
        state.registrationMessage = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrationMessage = action.payload.message;
        state.emailToVerify = action.payload.email;
        state.isError = undefined;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = undefined;
        state.isError = action.payload;
      });

    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
          state.isError = undefined;
        } else {
          state.isAuthenticated = false;
          state.user = undefined;
          state.isError = undefined;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = undefined;
        state.isError = undefined;
      });

    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = undefined;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = undefined;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = undefined;
        state.isError = undefined;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isError = undefined;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = undefined;
        state.isError = action.payload;
      });
  },
});

export const { clearError, updateUser, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
