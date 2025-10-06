import { RootState } from "../store";

export const selectTopics = (state: RootState) => state.vocabulary.topics;

export const selectCurrentTopic = (state: RootState) =>
  state.vocabulary.currentTopic;

export const selectCurrentWords = (state: RootState) =>
  state.vocabulary.currentWords;

export const selectCurrentWordIndex = (state: RootState) =>
  state.vocabulary.currentWordIndex;

export const selectSearchQuery = (state: RootState) =>
  state.vocabulary.searchQuery;

export const selectFilteredTopics = (state: RootState) =>
  state.vocabulary.filteredTopics;

export const selectLoading = (state: RootState) => state.vocabulary.isLoading;

export const selectError = (state: RootState) => state.vocabulary.isError;
