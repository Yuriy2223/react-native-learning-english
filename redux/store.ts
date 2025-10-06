import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authReducer } from "./auth/slice";
import { grammarReducer } from "./grammar/slice";
import { phrasesReducer } from "./phrases/slice";
import { settingsReducer } from "./settings/slice";
import { userReducer } from "./user/slice";
import { vocabularyReducer } from "./vocabulary/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    vocabulary: vocabularyReducer,
    phrases: phrasesReducer,
    grammar: grammarReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
