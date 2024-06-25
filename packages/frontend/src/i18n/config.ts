import i18n from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

import nb from './resources/nb.json';
import en from './resources/en.json';

const i18nInitConfig = {
  resources: {
    nb: { translation: nb },
    en: { translation: en },
  },
  lng: 'nb',
  fallbackLng: 'nb',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
};

i18n.use(ICU).use(initReactI18next).init(i18nInitConfig);

export { i18n };
