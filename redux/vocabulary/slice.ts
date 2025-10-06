import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Topic, Word } from "../../types";
import {
  fetchTopicWords,
  fetchVocabularyTopics,
  markWordAsKnown,
} from "./operations";

interface VocabularyState {
  topics: Topic[];
  currentTopic: Topic | null;
  currentWords: Word[];
  currentWordIndex: number;
  searchQuery: string;
  filteredTopics: Topic[];
  isLoading: boolean;
  isError: string | null;
}

const initialState: VocabularyState = {
  topics: [],
  currentTopic: null,
  currentWords: [],
  currentWordIndex: 0,
  searchQuery: "",
  filteredTopics: [],
  isLoading: false,
  isError: null,
};

const vocabularySlice = createSlice({
  name: "vocabulary",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredTopics = action.payload.trim()
        ? state.topics.filter(
            (topic) =>
              topic.title
                .toLowerCase()
                .includes(action.payload.toLowerCase()) ||
              topic.description
                .toLowerCase()
                .includes(action.payload.toLowerCase())
          )
        : state.topics;
    },

    setCurrentTopic: (state, action: PayloadAction<Topic>) => {
      state.currentTopic = action.payload;
      state.currentWordIndex = 0;
    },

    nextWord: (state) => {
      if (state.currentWordIndex < state.currentWords.length - 1) {
        state.currentWordIndex += 1;
      }
    },

    previousWord: (state) => {
      if (state.currentWordIndex > 0) {
        state.currentWordIndex -= 1;
      }
    },

    resetWordIndex: (state) => {
      state.currentWordIndex = 0;
    },

    updateTopicProgress: (
      state,
      action: PayloadAction<{ topicId: string; increment: number }>
    ) => {
      const topic = state.topics.find((t) => t.id === action.payload.topicId);
      if (topic) {
        topic.completedItems = Math.min(
          topic.completedItems + action.payload.increment,
          topic.totalItems
        );
      }

      const filteredTopic = state.filteredTopics.find(
        (t) => t.id === action.payload.topicId
      );
      if (filteredTopic) {
        filteredTopic.completedItems = Math.min(
          filteredTopic.completedItems + action.payload.increment,
          filteredTopic.totalItems
        );
      }
    },

    clearError: (state) => {
      state.isError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVocabularyTopics.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchVocabularyTopics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topics = action.payload;
        state.filteredTopics = action.payload;
        state.isError = null;
      })
      .addCase(fetchVocabularyTopics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload as string;
      });

    builder
      .addCase(fetchTopicWords.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchTopicWords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWords = action.payload;
        state.currentWordIndex = 0;
        state.isError = null;
      })
      .addCase(fetchTopicWords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload as string;
      });

    builder
      .addCase(markWordAsKnown.fulfilled, (state, action) => {
        const word = state.currentWords.find(
          (w) => w.id === action.payload.wordId
        );
        if (word) {
          word.isKnown = action.payload.isKnown;
        }
      })
      .addCase(markWordAsKnown.rejected, (state, action) => {
        state.isError = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setCurrentTopic,
  nextWord,
  previousWord,
  resetWordIndex,
  updateTopicProgress,
  clearError,
} = vocabularySlice.actions;

export const vocabularyReducer = vocabularySlice.reducer;
