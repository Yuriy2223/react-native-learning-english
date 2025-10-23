import { RootState } from "../store";

export const selectAchievements = (state: RootState) =>
  state.achievements.achievements;

export const selectUserStats = (state: RootState) =>
  state.achievements.userStats;

export const selectAchievementsLoading = (state: RootState) =>
  state.achievements.isLoading;
