// i18n/config.ts
import i18n from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { STORAGE_KEYS } from "../constants";
import { storage } from "../utils";

i18n
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      if (language === "uk") {
        return import("./locales/uk.json");
      }
      return import("./locales/en.json");
    })
  )
  .use(initReactI18next)
  .init({
    lng: "uk",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },

    react: {
      // useSuspense: false,
      useSuspense: true,
    },
  });

const loadLanguagePreference = async () => {
  try {
    const settings = await storage.getItem(STORAGE_KEYS.APP_SETTINGS);
    if (settings?.language) {
      await i18n.changeLanguage(settings.language);
    }
  } catch (error) {
    console.error("Error loading language preference:", error);
  }
};

loadLanguagePreference();

export default i18n;
