import { showToast } from "@/hooks/showToast";
import { apiService } from "@/services/api";
import {
  GrammarQuestion,
  GrammarRule,
  TestResult,
  Topic,
} from "@/types/grammar.type";
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

export const updateRuleStatus = createAsyncThunk<
  { ruleId: string; topicId: string; isCompleted: boolean },
  { ruleId: string; topicId: string; isCompleted: boolean },
  { rejectValue: string }
>(
  "grammar/updateRuleStatus",
  async ({ ruleId, topicId, isCompleted }, { rejectWithValue }) => {
    try {
      await apiService.request(`/grammar/rules/${ruleId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isCompleted }),
      });
      return { ruleId, topicId, isCompleted };
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast.error({
          message: error.message || "Помилка оновлення статусу правила",
        });
        return rejectWithValue(
          error.message || "Помилка оновлення статусу правила"
        );
      }
      showToast.error({ message: "Помилка оновлення статусу правила" });
      return rejectWithValue("Помилка оновлення статусу правила");
    }
  }
);

export const markTopicAsCompleted = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("grammar/markTopicAsCompleted", async (topicId, { rejectWithValue }) => {
  try {
    await apiService.request(`/grammar/topics/${topicId}/complete`, {
      method: "POST",
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

export const fetchGrammarQuestions = createAsyncThunk<
  GrammarQuestion[],
  string,
  { rejectValue: string }
>("grammar/fetchQuestions", async (topicId, { rejectWithValue }) => {
  try {
    const response = await apiService.request<GrammarQuestion[]>(
      `/grammar/topics/${topicId}/questions`
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка завантаження питань тесту",
      });
      return rejectWithValue(
        error.message || "Помилка завантаження питань тесту"
      );
    }
    showToast.error({ message: "Помилка завантаження питань тесту" });
    return rejectWithValue("Помилка завантаження питань тесту");
  }
});

export const submitGrammarTest = createAsyncThunk<
  TestResult,
  { topicId: string; answers: number[] },
  { rejectValue: string }
>("grammar/submitTest", async ({ topicId, answers }, { rejectWithValue }) => {
  try {
    const response = await apiService.request<TestResult>(
      `/grammar/topics/${topicId}/submit-test`,
      {
        method: "POST",
        body: JSON.stringify({ answers }),
      }
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка відправки тесту",
      });
      return rejectWithValue(error.message || "Помилка відправки тесту");
    }
    showToast.error({ message: "Помилка відправки тесту" });
    return rejectWithValue("Помилка відправки тесту");
  }
});
