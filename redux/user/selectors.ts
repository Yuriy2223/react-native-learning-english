import { RootState } from "../store";

export const selectProgress = (state: RootState) => state.user.progress;

export const selectLoading = (state: RootState) => state.user.isLoading;

export const selectError = (state: RootState) => state.user.isError;

export const selectStartTime = (state: RootState) =>
  state.user.studySession.startTime;

export const selectIsSessionActive = (state: RootState) =>
  state.user.studySession.isActive;

export const selectCurrentSessionMinutes = (state: RootState) =>
  state.user.studySession.currentSessionMinutes;
