import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Phrase, Topic } from "../../types";
import {
  fetchPhrasesTopics,
  fetchTopicPhrases,
  markPhraseAsKnown,
} from "./operations";

interface PhrasesState {
  topics: Topic[];
  currentTopic: Topic | null;
  currentPhrases: Phrase[];
  currentPhraseIndex: number;
  searchQuery: string;
  filteredTopics: Topic[];
  isLoading: boolean;
  isError: string | null;
}

const initialState: PhrasesState = {
  topics: [],
  currentTopic: null,
  currentPhrases: [],
  currentPhraseIndex: 0,
  searchQuery: "",
  filteredTopics: [],
  isLoading: false,
  isError: null,
};

const phrasesSlice = createSlice({
  name: "phrases",
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
      state.currentPhraseIndex = 0;
    },

    nextPhrase: (state) => {
      if (state.currentPhraseIndex < state.currentPhrases.length - 1) {
        state.currentPhraseIndex += 1;
      }
    },

    previousPhrase: (state) => {
      if (state.currentPhraseIndex > 0) {
        state.currentPhraseIndex -= 1;
      }
    },

    resetPhraseIndex: (state) => {
      state.currentPhraseIndex = 0;
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
      .addCase(fetchPhrasesTopics.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchPhrasesTopics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topics = action.payload;
        state.filteredTopics = action.payload;
        state.isError = null;
      })
      .addCase(fetchPhrasesTopics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload as string;
      });

    builder
      .addCase(fetchTopicPhrases.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchTopicPhrases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPhrases = action.payload;
        state.currentPhraseIndex = 0;
        state.isError = null;
      })
      .addCase(fetchTopicPhrases.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload as string;
      });

    builder
      .addCase(markPhraseAsKnown.fulfilled, (state, action) => {
        const phrase = state.currentPhrases.find(
          (p) => p.id === action.payload.phraseId
        );
        if (phrase) {
          phrase.isKnown = action.payload.isKnown;
        }
      })
      .addCase(markPhraseAsKnown.rejected, (state, action) => {
        state.isError = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setCurrentTopic,
  nextPhrase,
  previousPhrase,
  resetPhraseIndex,
  updateTopicProgress,
  clearError,
} = phrasesSlice.actions;

export const phrasesReducer = phrasesSlice.reducer;
