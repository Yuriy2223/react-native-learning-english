// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { apiService } from "../../services/api";

// export const fetchPhrasesTopics = createAsyncThunk(
//   "phrases/fetchTopics",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiService.getPhrasesTopics();
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch phrases topics");
//     }
//   }
// );

// export const fetchTopicPhrases = createAsyncThunk(
//   "phrases/fetchTopicPhrases",
//   async (topicId: string, { rejectWithValue }) => {
//     try {
//       const response = await apiService.getTopicPhrases(topicId);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch phrases");
//     }
//   }
// );

// export const markPhraseAsKnown = createAsyncThunk(
//   "phrases/markPhraseAsKnown",
//   async (
//     { phraseId, isKnown }: { phraseId: string; isKnown: boolean },
//     { rejectWithValue }
//   ) => {
//     try {
//       await apiService.updatePhraseStatus(phraseId, isKnown);
//       return { phraseId, isKnown };
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to update phrase status");
//     }
//   }
// );
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";

export const fetchPhrasesTopics = createAsyncThunk(
  "phrases/fetchTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getPhrasesTopics();
      console.log("Fetched phrases topics:", response.length);
      return response;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch phrases topics";
      console.error("Error fetching phrases topics:", message);
      return rejectWithValue(message);
    }
  }
);

export const fetchTopicPhrases = createAsyncThunk(
  "phrases/fetchTopicPhrases",
  async (topicId: string, { rejectWithValue }) => {
    try {
      console.log("Fetching phrases for topic:", topicId);
      const response = await apiService.getTopicPhrases(topicId);
      console.log("Fetched phrases:", response.length);
      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch phrases";
      console.error("Error fetching phrases:", message);
      return rejectWithValue(message);
    }
  }
);

export const markPhraseAsKnown = createAsyncThunk(
  "phrases/markPhraseAsKnown",
  async (
    { phraseId, isKnown }: { phraseId: string; isKnown: boolean },
    { rejectWithValue }
  ) => {
    try {
      await apiService.updatePhraseStatus(phraseId, isKnown);
      console.log(
        `Phrase ${phraseId} marked as ${isKnown ? "known" : "unknown"}`
      );
      return { phraseId, isKnown };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update phrase status";
      console.error("Error updating phrase status:", message);
      return rejectWithValue(message);
    }
  }
);
