import { showToast } from "@/hooks/showToast";
import { apiService } from "@/services/api";
import { Phrase, Topic } from "@/types/phrases.type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkAchievements } from "../achievements/operations";

export const fetchPhrasesTopics = createAsyncThunk<
  Topic[],
  void,
  { rejectValue: string }
>("phrases/fetchTopics", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.request<Topic[]>("/phrases/topics");
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка завантаження тем фраз",
      });
      return rejectWithValue(error.message || "Помилка завантаження тем фраз");
    }
    showToast.error({ message: "Помилка завантаження тем фраз" });
    return rejectWithValue("Помилка завантаження тем фраз");
  }
});

export const fetchTopicPhrases = createAsyncThunk<
  Phrase[],
  string,
  { rejectValue: string }
>("phrases/fetchTopicPhrases", async (topicId, { rejectWithValue }) => {
  try {
    const response = await apiService.request<Phrase[]>(
      `/phrases/topics/${topicId}/phrases`
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      showToast.error({
        message: error.message || "Помилка завантаження фраз",
      });
      return rejectWithValue(error.message || "Помилка завантаження фраз");
    }
    showToast.error({ message: "Помилка завантаження фраз" });
    return rejectWithValue("Помилка завантаження фраз");
  }
});

export const markPhraseAsKnown = createAsyncThunk<
  { phraseId: string; isKnown: boolean },
  { phraseId: string; isKnown: boolean },
  { rejectValue: string }
>(
  "phrases/markPhraseAsKnown",
  async ({ phraseId, isKnown }, { rejectWithValue, dispatch }) => {
    try {
      await apiService.request(`/phrases/${phraseId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isKnown }),
      });

      showToast.success({
        message: isKnown
          ? "Фразу позначено як вивчену"
          : "Статус фрази оновлено",
        duration: 2000,
      });

      if (isKnown) {
        dispatch(checkAchievements());
      }

      return { phraseId, isKnown };
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast.error({
          message: error.message || "Помилка оновлення статусу фрази",
        });
        return rejectWithValue(
          error.message || "Помилка оновлення статусу фрази"
        );
      }
      showToast.error({ message: "Помилка оновлення статусу фрази" });
      return rejectWithValue("Помилка оновлення статусу фрази");
    }
  }
);
