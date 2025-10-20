import { RootState } from "../store";

export const selectTopics = (state: RootState) => state.grammar.topics;

export const selectCurrentTopic = (state: RootState) =>
  state.grammar.currentTopic;

export const selectCurrentRules = (state: RootState) =>
  state.grammar.currentRules;

export const selectSearchQuery = (state: RootState) =>
  state.grammar.searchQuery;

export const selectFilteredTopics = (state: RootState) =>
  state.grammar.filteredTopics;

export const selectGroupedTopics = (state: RootState) =>
  state.grammar.groupedTopics;

export const selectLoading = (state: RootState) => state.grammar.isLoading;

export const selectError = (state: RootState) => state.grammar.isError;

export const selectCurrentQuestions = (state: RootState) =>
  state.grammar.currentQuestions;

export const selectTestResult = (state: RootState) => state.grammar.testResult;

export const selectTestLoading = (state: RootState) =>
  state.grammar.isTestLoading;
