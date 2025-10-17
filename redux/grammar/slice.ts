import { GrammarRule, Topic } from "@/types/grammar.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchGrammarTopics,
  fetchTopicRules,
  markTopicAsCompleted,
} from "./operations";

export interface GrammarState {
  topics: Topic[];
  currentTopic?: Topic;
  currentRules: GrammarRule[];
  searchQuery: string;
  filteredTopics: Topic[];
  groupedTopics: Record<string, Topic[]>;
  isLoading: boolean;
  isError?: string;
}

const initialState: GrammarState = {
  topics: [],
  currentTopic: undefined,
  currentRules: [],
  searchQuery: "",
  filteredTopics: [],
  groupedTopics: {},
  isLoading: false,
  isError: undefined,
};

const grammarSlice = createSlice({
  name: "grammar",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      const query = action.payload.trim().toLowerCase();

      if (query) {
        state.filteredTopics = state.topics.filter(
          (topic) =>
            topic.title.toLowerCase().includes(query) ||
            topic.description.toLowerCase().includes(query)
        );
      } else {
        state.filteredTopics = state.topics;
      }

      state.groupedTopics = state.filteredTopics.reduce((acc, topic) => {
        if (!acc[topic.difficulty]) {
          acc[topic.difficulty] = [];
        }
        acc[topic.difficulty].push(topic);
        return acc;
      }, {} as Record<string, Topic[]>);
    },

    setCurrentTopic: (state, action: PayloadAction<Topic>) => {
      state.currentTopic = action.payload;
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

      Object.keys(state.groupedTopics).forEach((difficulty) => {
        const groupedTopic = state.groupedTopics[difficulty].find(
          (t) => t.id === action.payload.topicId
        );
        if (groupedTopic) {
          groupedTopic.completedItems = Math.min(
            groupedTopic.completedItems + action.payload.increment,
            groupedTopic.totalItems
          );
        }
      });
    },

    clearError: (state) => {
      state.isError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGrammarTopics.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(fetchGrammarTopics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topics = action.payload;
        state.filteredTopics = action.payload;
        state.isError = undefined;

        state.groupedTopics = action.payload.reduce((acc, topic) => {
          if (!acc[topic.difficulty]) {
            acc[topic.difficulty] = [];
          }
          acc[topic.difficulty].push(topic);
          return acc;
        }, {} as Record<string, Topic[]>);
      })
      .addCase(fetchGrammarTopics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(fetchTopicRules.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(fetchTopicRules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRules = action.payload;
        state.isError = undefined;
      })
      .addCase(fetchTopicRules.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(markTopicAsCompleted.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(markTopicAsCompleted.fulfilled, (state, action) => {
        state.isLoading = false;
        const topicId = action.payload;
        const topic = state.topics.find((t) => t.id === topicId);
        if (topic) {
          topic.completedItems = topic.totalItems;
        }

        const filteredTopic = state.filteredTopics.find(
          (t) => t.id === topicId
        );
        if (filteredTopic) {
          filteredTopic.completedItems = filteredTopic.totalItems;
        }

        Object.keys(state.groupedTopics).forEach((difficulty) => {
          const groupedTopic = state.groupedTopics[difficulty].find(
            (t) => t.id === topicId
          );
          if (groupedTopic) {
            groupedTopic.completedItems = groupedTopic.totalItems;
          }
        });
        state.isError = undefined;
      })
      .addCase(markTopicAsCompleted.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setCurrentTopic,
  updateTopicProgress,
  clearError,
} = grammarSlice.actions;

export const grammarReducer = grammarSlice.reducer;
