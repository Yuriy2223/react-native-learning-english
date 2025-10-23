import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "../../hooks/showToast";
import { apiService } from "../../services/api";
import { Exercise, ExerciseTopic } from "../../types/exercises.types";
import { checkAchievements } from "../achievements/operations";

export const fetchExerciseTopics = createAsyncThunk<
  ExerciseTopic[],
  void,
  { rejectValue: string }
>("exercises/fetchTopics", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.request<ExerciseTopic[]>(
      "/exercises/topics"
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка завантаження тем вправ",
      });
      return rejectWithValue(error.message || "Помилка завантаження тем вправ");
    }
    showToast.error({ message: "Помилка завантаження тем вправ" });
    return rejectWithValue("Помилка завантаження тем вправ");
  }
});

export const fetchTopicExercises = createAsyncThunk<
  Exercise[],
  string,
  { rejectValue: string }
>("exercises/fetchTopicExercises", async (topicId, { rejectWithValue }) => {
  try {
    const response = await apiService.request<Exercise[]>(
      `/exercises/topics/${topicId}/exercises`
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка завантаження вправ",
      });
      return rejectWithValue(error.message || "Помилка завантаження вправ");
    }
    showToast.error({ message: "Помилка завантаження вправ" });
    return rejectWithValue("Помилка завантаження вправ");
  }
});

export const submitExerciseAnswer = createAsyncThunk<
  { exerciseId: string; isCorrect: boolean; earnedPoints: number },
  {
    exerciseId: string;
    answer: string;
    isCorrect: boolean;
    earnedPoints: number;
  },
  { rejectValue: string }
>(
  "exercises/submitAnswer",
  async (
    { exerciseId, answer, isCorrect, earnedPoints },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await apiService.request(`/exercises/${exerciseId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answer, isCorrect, earnedPoints }),
      });

      if (isCorrect) {
        dispatch(checkAchievements());
      }

      return { exerciseId, isCorrect, earnedPoints };
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast.error({
          message: error.message || "Помилка збереження відповіді",
        });
        return rejectWithValue(error.message || "Помилка збереження відповіді");
      }
      showToast.error({ message: "Помилка збереження відповіді" });
      return rejectWithValue("Помилка збереження відповіді");
    }
  }
);
