import { RootState } from "../store";

export const selectExerciseTopics = (state: RootState) =>
  state.exercises.topics;

export const selectCurrentExerciseTopic = (state: RootState) =>
  state.exercises.currentTopic;

export const selectCurrentExercises = (state: RootState) =>
  state.exercises.currentExercises;

export const selectCurrentExerciseIndex = (state: RootState) =>
  state.exercises.currentExerciseIndex;

export const selectExerciseSearchQuery = (state: RootState) =>
  state.exercises.searchQuery;

export const selectFilteredExerciseTopics = (state: RootState) =>
  state.exercises.filteredTopics;

export const selectExerciseLoading = (state: RootState) =>
  state.exercises.isLoading;

export const selectExerciseError = (state: RootState) =>
  state.exercises.isError;
