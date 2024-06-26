import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { profile } from '../api/queries.ts';

export const useProfile = () => {
  const { data } = useQuery<Awaited<ReturnType<typeof profile>>>(import.meta.url, () => profile());
  const { i18n } = useTranslation();

  const language = data?.profile?.language || i18n.language || 'nb';

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what trigges this code is needed
  useEffect(() => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, [language]);
};
