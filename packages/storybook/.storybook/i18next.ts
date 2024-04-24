import { nbResources } from '../../frontend';
import i18n from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

i18n
  .use(ICU)
  .use(initReactI18next)
  .init({
    lng: 'nb',
    fallbackLng: 'nb',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    resources: {
      nb: {
        translation: nbResources,
      },
    },
    supportedLngs: ['nb'],
  });

export default i18n;
