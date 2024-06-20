import { SavedSearchesFieldsFragment, SavedSearchesQuery } from 'bff-types-generated';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { deleteSavedSearch, fetchSavedSearches } from '../../api/queries';
import { useSnackbar } from '../../components/Snackbar/useSnackbar';
import { EditSavedSearch } from './EditSearchesItem';
import { SavedSearchesItem } from './SavedSearchesItem';
import styles from './savedSearches.module.css';
import { formatDistance } from "date-fns";
import { nb } from 'date-fns/locale/nb'

export const SavedSearches = () => {
  const queryClient = useQueryClient();
  const [selectedSavedSearch, setSelectedSavedSearch] = useState<SavedSearchesFieldsFragment>();
  const { t } = useTranslation();
  const { data } = useSavedSearches();
  const savedSearches = data?.savedSearches as SavedSearchesFieldsFragment[];
  const { openSnackbar } = useSnackbar();

  const handleDeleteSearch = async (id: number) => {
    if (!id) return;

    try {
      await deleteSavedSearch(id);
      openSnackbar({
        message: t('savedSearches.deleted_success'),
        variant: 'success',
      });
      await queryClient.invalidateQueries('savedSearches');
    } catch (error) {
      console.error('Failed to delete saved search:', error);
      openSnackbar({
        message: t('savedSearches.delete_failed'),
        variant: 'error',
      });
    }
  };

  return (
    <main>
      <section className={styles.savedSearchesWrapper}>
        <EditSavedSearch
          key={selectedSavedSearch?.id}
          isOpen={!!selectedSavedSearch}
          savedSearch={selectedSavedSearch}
          onDelete={handleDeleteSearch}
          onClose={() => setSelectedSavedSearch(undefined)}
        />
        <div className={styles.title}>{t('savedSearches.title', { count: savedSearches?.length || 0 })}</div>
        {!!savedSearches?.length && (
          <div className={styles.savedSearchesContainer}>
            {savedSearches?.map((search) => (
              <SavedSearchesItem
                key={search?.id}
                savedSearch={search}
                onDelete={handleDeleteSearch}
                setSelectedSavedSearch={setSelectedSavedSearch}
              />
            ))}
          </div>
        )}
        <LastUpdated searches={savedSearches} />
      </section>
    </main>
  );
};

export const useSavedSearches = () => useQuery<SavedSearchesQuery, Error>('savedSearches', fetchSavedSearches);

export const autoFormatRelativeTime = (date: Date): string => {
  try {
    const result = formatDistance(new Date(date), new Date(), {
      locale: nb,
      addSuffix: true
    })
    return result
  } catch (error) {
    console.error('autoFormatRelativeTime Error: ', error);
    return '';
  }
};

const getMostRecentSearchDate = (data: SavedSearchesFieldsFragment[]): Date | null => {
  try {
    if (!data?.length) {
      return null;
    }
    const timestamp = data?.reduce((latest, search) => {
      return parseInt(search?.updatedAt!, 10) > parseInt(latest?.updatedAt!, 10) ? search : latest;
    })!.updatedAt;
    return new Date(parseInt(timestamp, 10));
  } catch (error) {
    console.error('getMostRecentSearchDate Error: ', error);
    return null;
  }
};

interface LastUpdatedProps {
  searches?: SavedSearchesFieldsFragment[];
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
