import { showToast } from "@/hooks/showToast";
import { apiService } from "@/services/api";
import { GrammarRule, Topic } from "@/types/grammar.type";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchGrammarTopics = createAsyncThunk<
  Topic[],
  void,
  { rejectValue: string }
>("grammar/fetchTopics", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.request<Topic[]>("/grammar/topics");
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка завантаження тем граматики",
      });
      return rejectWithValue(
        error.message || "Помилка завантаження тем граматики"
      );
    }
    showToast.error({ message: "Помилка завантаження тем граматики" });
    return rejectWithValue("Помилка завантаження тем граматики");
  }
});

export const fetchTopicRules = createAsyncThunk<
  GrammarRule[],
  string,
  { rejectValue: string }
>("grammar/fetchTopicRules", async (topicId, { rejectWithValue }) => {
  try {
    const response = await apiService.request<GrammarRule[]>(
      `/grammar/topics/${topicId}/rules`
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка завантаження правил граматики",
      });
      return rejectWithValue(
        error.message || "Помилка завантаження правил граматики"
      );
    }
    showToast.error({ message: "Помилка завантаження правил граматики" });
    return rejectWithValue("Помилка завантаження правил граматики");
  }
});

export const markTopicAsCompleted = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("grammar/markTopicAsCompleted", async (topicId, { rejectWithValue }) => {
  try {
    await apiService.request(`/grammar/topics/${topicId}/complete`, {
      method: "POST",
    });

    showToast.success({
      message: "Тему успішно завершено!",
      duration: 2000,
    });

    return topicId;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка завершення теми",
      });
      return rejectWithValue(error.message || "Помилка завершення теми");
    }
    showToast.error({ message: "Помилка завершення теми" });
    return rejectWithValue("Помилка завершення теми");
  }
});
