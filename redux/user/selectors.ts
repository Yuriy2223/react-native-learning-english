import { RootState } from "../store";

export const selectUser = (state: RootState) => state.user.user;

export const selectUserProgress = (state: RootState) => state.user.progress;

export const selectKnownWords = (state: RootState) =>
  state.user.progress?.knownWords ?? 0;

export const selectKnownPhrases = (state: RootState) =>
  state.user.progress?.knownPhrases ?? 0;

export const selectStreak = (state: RootState) =>
  state.user.progress?.streak ?? 0;

export const selectTotalPoints = (state: RootState) =>
  state.user.progress?.totalPoints ?? 0;

export const selectUserIsLoading = (state: RootState) => state.user.isLoading;

export const selectUserProgressLoading = (state: RootState) =>
  state.user.isProgressLoading;

export const selectUserError = (state: RootState) => state.user.isError;

export const selectStudySession = (state: RootState) => state.user.studySession;

export const selectStartTime = (state: RootState) =>
  state.user.studySession.startTime;

export const selectIsSessionActive = (state: RootState) =>
  state.user.studySession.isActive;

export const selectCurrentSessionMinutes = (state: RootState) =>
  state.user.studySession.currentSessionMinutes;
