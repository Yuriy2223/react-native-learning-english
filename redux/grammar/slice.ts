import {
  GrammarQuestion,
  GrammarRule,
  TestResult,
  Topic,
} from "@/types/grammar.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchGrammarQuestions,
  fetchGrammarTopics,
  fetchTopicRules,
  markTopicAsCompleted,
  submitGrammarTest,
  updateRuleStatus,
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
  currentQuestions: GrammarQuestion[];
  testResult?: TestResult;
  isTestLoading: boolean;
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
  currentQuestions: [],
  testResult: undefined,
  isTestLoading: false,
};

const resyncFilteredData = (state: GrammarState) => {
  const query = state.searchQuery.trim().toLowerCase();

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
};

const grammarSlice = createSlice({
  name: "grammar",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      resyncFilteredData(state);
    },
    setCurrentTopic: (state, action: PayloadAction<Topic>) => {
      state.currentTopic = action.payload;
    },
    clearError: (state) => {
      state.isError = undefined;
    },
    clearTestResult: (state) => {
      state.testResult = undefined;
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
        state.isError = undefined;
        resyncFilteredData(state);
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
      .addCase(updateRuleStatus.pending, (state) => {
        state.isError = undefined;
      })
      .addCase(updateRuleStatus.fulfilled, (state, action) => {
        const { topicId, ruleId, isCompleted } = action.payload;
        const ruleIndex = state.currentRules.findIndex((r) => r.id === ruleId);
        if (ruleIndex !== -1) {
          const wasCompleted = state.currentRules[ruleIndex].isCompleted;
          state.currentRules[ruleIndex].isCompleted = isCompleted;

          const topic = state.topics.find((t) => t.id === topicId);
          if (topic) {
            if (isCompleted && !wasCompleted) {
              topic.completedItems = Math.min(
                topic.completedItems + 1,
                topic.totalItems
              );
            } else if (!isCompleted && wasCompleted) {
              topic.completedItems = Math.max(topic.completedItems - 1, 0);
            }
          }
        }

        state.isError = undefined;
        resyncFilteredData(state);
      })
      .addCase(updateRuleStatus.rejected, (state, action) => {
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

        state.currentRules = state.currentRules.map((rule) => ({
          ...rule,
          isCompleted: true,
        }));

        state.isError = undefined;
        resyncFilteredData(state);
      })
      .addCase(markTopicAsCompleted.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
    builder
      .addCase(fetchGrammarQuestions.pending, (state) => {
        state.isTestLoading = true;
        state.isError = undefined;
      })
      .addCase(fetchGrammarQuestions.fulfilled, (state, action) => {
        state.isTestLoading = false;
        state.currentQuestions = action.payload;
        state.isError = undefined;
      })
      .addCase(fetchGrammarQuestions.rejected, (state, action) => {
        state.isTestLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(submitGrammarTest.pending, (state) => {
        state.isTestLoading = true;
        state.isError = undefined;
      })
      .addCase(submitGrammarTest.fulfilled, (state, action) => {
        state.isTestLoading = false;
        state.testResult = action.payload;
        state.isError = undefined;
      })
      .addCase(submitGrammarTest.rejected, (state, action) => {
        state.isTestLoading = false;
        state.isError = action.payload;
      });
  },
});

export const { setSearchQuery, setCurrentTopic, clearError, clearTestResult } =
  grammarSlice.actions;

export const grammarReducer = grammarSlice.reducer;
