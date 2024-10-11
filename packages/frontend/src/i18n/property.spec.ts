import i18n from 'i18next';
import { describe, expect, it } from 'vitest';
import { getPreferredPropertyByLocale } from './property.ts';

i18n.init({
  lng: 'nb',
  resources: {
    en: {
      translation: {},
    },
    nb: {
      translation: {},
    },
  },
});

const values = [
  {
    languageCode: 'en',
    value: 'English',
  },
  {
    languageCode: 'nb',
    value: 'Bokmål',
  },
  {
    languageCode: 'nn',
    value: 'Nynorsk',
  },
];

describe('i18n/property', () => {
  it('should return the preferred property by locale', () => {
    i18n.changeLanguage('en');
    expect(getPreferredPropertyByLocale(values)).toEqual({
      languageCode: 'en',
      value: 'English',
    });
  });

  it('should return the fallback locale property', () => {
    i18n.changeLanguage('de');
    expect(getPreferredPropertyByLocale(values)).toEqual({
      languageCode: 'nb',
      value: 'Bokmål',
    });
  });

  it('should return the first item if neither preferred property or fallback property is present', () => {
    i18n.changeLanguage('nb');
    expect(getPreferredPropertyByLocale([{ languageCode: 'en', value: 'English' }])).toEqual({
      languageCode: 'en',
      value: 'English',
    });
  });
});
