import i18next from "i18next";
import resources from "./locales";
import LanguageDetector from "i18next-browser-languagedetector";

export async function initI18n() {
  await i18next.use(LanguageDetector).init({
    resources,
    debug: import.meta.env.DEV,
    fallbackLng: "en",
  });
}

export const { t } = i18next;
