import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import common_de from "./locales/de/common.json";
import common_ar from "./locales/ar/common.json";

// Sprachen der Benutzeroberfläche (UI-Sprache).
// Nicht zu verwechseln mit der Lernsprache des Kindes (kommt aus /languages).
export const SUPPORTED_LANGUAGES = ["de", "ar"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const RTL_LANGUAGES: SupportedLanguage[] = ["ar"];

export const isRtl = (lng: string): boolean =>
  RTL_LANGUAGES.includes(lng as SupportedLanguage);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: { common: common_de },
      ar: { common: common_ar },
    },
    fallbackLng: "de",
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    defaultNS: "common",
    ns: ["common"],
    interpolation: {
      escapeValue: false, // React escaped bereits selbst
    },
    detection: {
      // Reihenfolge: zuerst explizit gewählte Sprache, dann Browser-Einstellung
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "ui_language",
    },
  });

export default i18n;
