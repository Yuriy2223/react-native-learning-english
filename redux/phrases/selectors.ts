import { RootState } from "../store";

export const selectTopics = (state: RootState) => state.phrases.topics;

export const selectCurrentTopic = (state: RootState) =>
  state.phrases.currentTopic;

export const selectCurrentPhrases = (state: RootState) =>
  state.phrases.currentPhrases;

export const selectCurrentPhraseIndex = (state: RootState) =>
  state.phrases.currentPhraseIndex;

export const selectSearchQuery = (state: RootState) =>
  state.phrases.searchQuery;

export const selectFilteredTopics = (state: RootState) =>
  state.phrases.filteredTopics;

export const selectLoading = (state: RootState) => state.phrases.isLoading;

export const selectError = (state: RootState) => state.phrases.isError;
