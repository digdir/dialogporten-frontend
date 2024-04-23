import { useTranslation } from 'react-i18next';
import styles from './savedSearches.module.css';
import { useQuery, useQueryClient } from 'react-query';
import { getSavedSearches } from '../../api/queries';
import { Filter } from '../../components/FilterBar';
import { SavedSearchesItem } from './SavedSearchesItem';

export const useSavedSearches = () => useQuery('savedSearches', getSavedSearches);

interface LastUpdatedProps {
  searches: SavedSearch[] | undefined;
}

const autoFormatRelativeTime = (date: Date, locale = 'nb-NO'): string => {
  const now = new Date();
  const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
  const absDiffInSeconds = Math.abs(diffInSeconds);

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (absDiffInSeconds < 60) {
    value = -Math.round(diffInSeconds);
    unit = 'second';
  } else if (absDiffInSeconds < 3600) {
    value = -Math.round(diffInSeconds / 60);
    unit = 'minute';
  } else if (absDiffInSeconds < 86400) {
    value = -Math.round(diffInSeconds / 3600);
    unit = 'hour';
  } else if (absDiffInSeconds < 2629800) {
    value = -Math.round(diffInSeconds / 86400);
    unit = 'day';
  } else if (absDiffInSeconds < 31557600) {
    value = -Math.round(diffInSeconds / 2629800);
    unit = 'month';
  } else {
    value = -Math.round(diffInSeconds / 31557600);
    unit = 'year';
  }

  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
  });

  return rtf.format(value, unit);
};

function getMostRecentSearchDate(searches: SavedSearch[]): Date | null {
  if (searches.length === 0) {
    return null;
  }

  const timestamp = searches.reduce((latest, search) => {
    return search.timestamp > latest.timestamp ? search : latest;
  }).timestamp;

  return new Date(timestamp);
}

const LastUpdated = ({ searches }: LastUpdatedProps) => {
  const { t } = useTranslation();
  if (!searches || !searches?.length) return null;
  const lastUpdated = getMostRecentSearchDate(searches) as Date;

  return (
    <div className={styles.lastUpdated}>
      {t('savedSearches.lastUpdated')}
      {autoFormatRelativeTime(lastUpdated)}
    </div>
  );
};

export interface SavedSearch {
  id: number;
  name: string;
  filters?: Filter[];
  searchString?: string;
  timestamp: string;
}

export const getSearchHistory = (): SavedSearch[] => {
  const historyJSON = localStorage.getItem('searchHistory');
  return historyJSON ? JSON.parse(historyJSON) : [];
};

export const SavedSearches = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { data: savedSearches } = useSavedSearches();

  const handleDeleteSearch = (id: number) => {
    if (!savedSearches) return;

    const newSearchHistory = savedSearches.filter((search) => search.id !== id);
    localStorage.setItem('searchHistory', JSON.stringify(newSearchHistory));
    queryClient.invalidateQueries('savedSearches');
  };

  return (
    <main>
      <section className={styles.savedSearchesWrapper}>
        <div className={styles.title}>{t('savedSearches.title', { count: savedSearches?.length || 0 })}</div>
        <div className={styles.savedSearchesContainer}>
          {savedSearches?.map((search) => (
            <SavedSearchesItem key={search.id} savedSearch={search} onDelete={handleDeleteSearch} />
          ))}
        </div>
        <LastUpdated searches={savedSearches} />
      </section>
    </main>
  );
};
