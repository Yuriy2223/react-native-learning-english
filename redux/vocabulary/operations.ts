import { showToast } from "@/hooks/showToast";
import { apiService } from "@/services/api";
import { Topic, Word } from "@/types/vocabulary.type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkAchievements } from "../achievements/operations";

export const fetchVocabularyTopics = createAsyncThunk<
  Topic[],
  void,
  { rejectValue: string }
>("vocabulary/fetchTopics", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.request<Topic[]>("/vocabulary/topics");
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка завантаження тем",
      });
      return rejectWithValue(error.message || "Помилка завантаження тем");
    }
    showToast.error({ message: "Помилка завантаження тем" });
    return rejectWithValue("Помилка завантаження тем");
  }
});

export const fetchTopicWords = createAsyncThunk<
  Word[],
  string,
  { rejectValue: string }
>("vocabulary/fetchTopicWords", async (topicId, { rejectWithValue }) => {
  try {
    const response = await apiService.request<Word[]>(
      `/vocabulary/topics/${topicId}/words`
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка завантаження слів",
      });
      return rejectWithValue(error.message || "Помилка завантаження слів");
    }
    showToast.error({ message: "Помилка завантаження слів" });
    return rejectWithValue("Помилка завантаження слів");
  }
});

export const markWordAsKnown = createAsyncThunk<
  { wordId: string; isKnown: boolean },
  { wordId: string; isKnown: boolean },
  { rejectValue: string }
>(
  "vocabulary/markWordAsKnown",
  async ({ wordId, isKnown }, { rejectWithValue, dispatch }) => {
    try {
      await apiService.request(`/vocabulary/words/${wordId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isKnown }),
      });

      showToast.success({
        message: isKnown
          ? "Слово позначено як вивчене"
          : "Статус слова оновлено",
        duration: 2000,
      });

      if (isKnown) {
        dispatch(checkAchievements());
      }

      return { wordId, isKnown };
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast.error({
          message: error.message || "Помилка оновлення статусу слова",
        });
        return rejectWithValue(
          error.message || "Помилка оновлення статусу слова"
        );
      }
      showToast.error({ message: "Помилка оновлення статусу слова" });
      return rejectWithValue("Помилка оновлення статусу слова");
    }
  }
);
