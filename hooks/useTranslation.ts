// hooks/useTranslation.ts
import { useTranslation as useI18nTranslation } from "react-i18next";
import { saveSettings } from "../redux/settings/operations";
import { updateLanguage } from "../redux/settings/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export const useTranslation = () => {
  const { t, i18n: i18nInstance } = useI18nTranslation();
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.settings);

  const changeLanguage = async (language: "uk" | "en") => {
    try {
      await i18nInstance.changeLanguage(language);
      dispatch(updateLanguage(language));

      // Save to storage
      const updatedSettings = { ...settings, language };
      await dispatch(saveSettings(updatedSettings));
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const currentLanguage = i18nInstance.language as "uk" | "en";

  return {
    t,
    changeLanguage,
    currentLanguage,
  };
};
