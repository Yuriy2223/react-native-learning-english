import { RootState } from "../store";

export const selectUser = (state: RootState) => state.auth.user;

export const selectIsLoading = (state: RootState) => state.auth.isLoading;

export const selectIsError = (state: RootState) => state.auth.isError;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectEmailToVerify = (state: RootState) =>
  state.auth.emailToVerify;
