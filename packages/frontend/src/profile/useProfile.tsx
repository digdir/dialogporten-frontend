import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { profile } from '../api/queries.ts';
import { QUERY_KEYS } from '../constants/queryKeys.ts';

export const useProfile = () => {
  const { data } = useQuery<Awaited<ReturnType<typeof profile>>>({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => profile(),
  });
  const { i18n } = useTranslation();

  const language = data?.profile?.language || i18n.language || 'nb';

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, [language]);
};
