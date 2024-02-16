import { initReactI18next } from "react-i18next";
import { nbResources } from 'frontend-design-poc';
import i18n from "i18next";

i18n.use(initReactI18next).init({
  lng: "nb",
  fallbackLng: "nb",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  resources: {
    nb: {
      translation: nbResources,
    },
  },
  supportedLngs: ["nb"],
});

export default i18n;
