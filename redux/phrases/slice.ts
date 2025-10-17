import { Phrase, Topic } from "@/types/phrases.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchPhrasesTopics,
  fetchTopicPhrases,
  markPhraseAsKnown,
} from "./operations";

export interface PhrasesState {
  topics: Topic[];
  currentTopic?: Topic;
  currentPhrases: Phrase[];
  currentPhraseIndex: number;
  searchQuery: string;
  filteredTopics: Topic[];
  isLoading: boolean;
  isError?: string;
}

const initialState: PhrasesState = {
  topics: [],
  currentTopic: undefined,
  currentPhrases: [],
  currentPhraseIndex: 0,
  searchQuery: "",
  filteredTopics: [],
  isLoading: false,
  isError: undefined,
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
      state.isError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhrasesTopics.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(fetchPhrasesTopics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topics = action.payload;
        state.filteredTopics = action.payload;
        state.isError = undefined;
      })
      .addCase(fetchPhrasesTopics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(fetchTopicPhrases.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(fetchTopicPhrases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPhrases = action.payload;
        state.currentPhraseIndex = 0;
        state.isError = undefined;
      })
      .addCase(fetchTopicPhrases.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(markPhraseAsKnown.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(markPhraseAsKnown.fulfilled, (state, action) => {
        state.isLoading = false;
        const phrase = state.currentPhrases.find(
          (p) => p.id === action.payload.phraseId
        );
        if (phrase) {
          phrase.isKnown = action.payload.isKnown;
        }
        state.isError = undefined;
      })
      .addCase(markPhraseAsKnown.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
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
