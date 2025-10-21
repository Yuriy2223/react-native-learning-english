import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exercise, ExerciseTopic } from "../../types/exercises.types";
import {
  fetchExerciseTopics,
  fetchTopicExercises,
  submitExerciseAnswer,
} from "./operations";

export interface ExercisesState {
  topics: ExerciseTopic[];
  currentTopic?: ExerciseTopic;
  currentExercises: Exercise[];
  currentExerciseIndex: number;
  searchQuery: string;
  filteredTopics: ExerciseTopic[];
  isLoading: boolean;
  isError?: string;
}

const initialState: ExercisesState = {
  topics: [],
  currentTopic: undefined,
  currentExercises: [],
  currentExerciseIndex: 0,
  searchQuery: "",
  filteredTopics: [],
  isLoading: false,
  isError: undefined,
};

const exercisesSlice = createSlice({
  name: "exercises",
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

    setCurrentTopic: (state, action: PayloadAction<ExerciseTopic>) => {
      state.currentTopic = action.payload;
      state.currentExerciseIndex = 0;
    },

    nextExercise: (state) => {
      if (state.currentExerciseIndex < state.currentExercises.length - 1) {
        state.currentExerciseIndex += 1;
      }
    },

    previousExercise: (state) => {
      if (state.currentExerciseIndex > 0) {
        state.currentExerciseIndex -= 1;
      }
    },

    resetExerciseIndex: (state) => {
      state.currentExerciseIndex = 0;
    },

    updateTopicProgress: (
      state,
      action: PayloadAction<{ topicId: string; earnedPoints: number }>
    ) => {
      const topic = state.topics.find((t) => t.id === action.payload.topicId);
      if (topic) {
        topic.completedItems = Math.min(
          topic.completedItems + 1,
          topic.totalItems
        );
        topic.earnedScore = Math.min(
          topic.earnedScore + action.payload.earnedPoints,
          topic.totalScore
        );
      }

      const filteredTopic = state.filteredTopics.find(
        (t) => t.id === action.payload.topicId
      );
      if (filteredTopic) {
        filteredTopic.completedItems = Math.min(
          filteredTopic.completedItems + 1,
          filteredTopic.totalItems
        );
        filteredTopic.earnedScore = Math.min(
          filteredTopic.earnedScore + action.payload.earnedPoints,
          filteredTopic.totalScore
        );
      }
    },

    clearError: (state) => {
      state.isError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExerciseTopics.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(fetchExerciseTopics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topics = action.payload;
        state.filteredTopics = action.payload;
        state.isError = undefined;
      })
      .addCase(fetchExerciseTopics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(fetchTopicExercises.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(fetchTopicExercises.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentExercises = action.payload;
        state.currentExerciseIndex = 0;
        state.isError = undefined;
      })
      .addCase(fetchTopicExercises.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(submitExerciseAnswer.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(submitExerciseAnswer.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = undefined;
      })
      .addCase(submitExerciseAnswer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setCurrentTopic,
  nextExercise,
  previousExercise,
  resetExerciseIndex,
  updateTopicProgress,
  clearError,
} = exercisesSlice.actions;

export const exercisesReducer = exercisesSlice.reducer;
