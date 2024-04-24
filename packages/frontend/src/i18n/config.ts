import i18n from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

import nb from './resources/nb.json';

const i18nInitConfig = {
  resources: {
    nb: { translation: nb },
  },
  lng: 'nb',
  fallbackLng: 'nb',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
};

i18n.use(ICU).use(initReactI18next).init(i18nInitConfig);
