import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";

export const fetchGrammarTopics = createAsyncThunk(
  "grammar/fetchTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getGrammarTopics();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch grammar topics");
    }
  }
);

export const fetchTopicRules = createAsyncThunk(
  "grammar/fetchTopicRules",
  async (topicId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getTopicRules(topicId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch grammar rules");
    }
  }
);

export const markTopicAsCompleted = createAsyncThunk(
  "grammar/markTopicAsCompleted",
  async (topicId: string, { rejectWithValue }) => {
    try {
      await apiService.markGrammarTopicCompleted(topicId);
      return topicId;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to mark topic as completed"
      );
    }
  }
);
