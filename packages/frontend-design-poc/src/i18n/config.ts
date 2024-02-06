import nb from "./resources/nb.json";

export const i18nInitConfig = {
  resources: {
    nb: { translation: nb },
  },
  lng: "nb",
  fallbackLng: "nb",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
};
