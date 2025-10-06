import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";

export const fetchVocabularyTopics = createAsyncThunk(
  "vocabulary/fetchTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getVocabularyTopics();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch vocabulary topics"
      );
    }
  }
);

export const fetchTopicWords = createAsyncThunk(
  "vocabulary/fetchTopicWords",
  async (topicId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getTopicWords(topicId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch words");
    }
  }
);

export const markWordAsKnown = createAsyncThunk(
  "vocabulary/markWordAsKnown",
  async (
    { wordId, isKnown }: { wordId: string; isKnown: boolean },
    { rejectWithValue }
  ) => {
    try {
      await apiService.updateWordStatus(wordId, isKnown);
      return { wordId, isKnown };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update word status");
    }
  }
);
