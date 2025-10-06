import { RootState } from "../store";

export const selectTopics = (state: RootState) => state.settings.settings;

export const selectLoading = (state: RootState) => state.settings.isLoading;

export const selectError = (state: RootState) => state.settings.isError;
