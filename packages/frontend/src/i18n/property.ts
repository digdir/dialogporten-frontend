import i18n from 'i18next';

export type LocalizationObject = {
  languageCode: string;
  value: string;
  [key: string]: unknown; // allows any other properties
};

export type ValueType = Array<LocalizationObject> | null | undefined;

/*
 * Returns the preferred property by locale, if it exists.
 * If the preferred locale does not exist, it will return the fallback locale.
 * If the fallback locale does not exist, it will return the first item in the array.
 * If the array is empty, it will return undefined.
 */
export const getPreferredPropertyByLocale = <T extends LocalizationObject>(
  value: Array<T> | null | undefined,
): T | undefined => {
  const fallbackLocale = 'nb';
  const currentLocale = i18n.language;

  if (value) {
    return (
      value.find((item) => item.languageCode === currentLocale) ??
      value.find((item) => item.languageCode === fallbackLocale) ??
      value[0]
    );
  }
  return undefined;
};
