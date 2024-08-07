import { Button, Modal } from '@digdir/designsystemet-react';
import type { SavedSearchesFieldsFragment, SavedSearchesQuery } from 'bff-types-generated';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { deleteSavedSearch, fetchSavedSearches } from '../../api/queries';
import { useSnackbar } from '../../components';
import { HorizontalLine } from '../../components';
import { ModalWithBackdrop } from '../../components/Backdrop';
import { type FormatDistanceFunction, useFormatDistance } from '../../i18n/useDateFnsLocale.tsx';
import { EditSavedSearch } from './EditSearchesItem';
import { SavedSearchesItem } from './SavedSearchesItem';
import { SavedSearchesSkeleton } from './SavedSearchesSkeleton';
import styles from './savedSearches.module.css';

interface DeleteSearchConfirmationProps {
  savedSearch: SavedSearchesFieldsFragment | false;
  onClose?: () => void;
  isOpen: boolean;
}

const DeleteSearchConfirmation = ({ savedSearch, onClose, isOpen }: DeleteSearchConfirmationProps) => {
  const { t } = useTranslation();
  const { openSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const handleDeleteSearch = async () => {
    console.log('handleDeleteSearch', savedSearch);
    if (!savedSearch || !savedSearch?.id) return;

    try {
      await deleteSavedSearch(savedSearch.id);
      openSnackbar({
        message: t('savedSearches.deleted_success'),
        variant: 'success',
      });
      onClose?.();
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
    <ModalWithBackdrop open={isOpen} onClose={onClose}>
      <Modal.Header className={styles.editSavedSearchHeader}>{t('savedSearches.confirm_delete_title')}</Modal.Header>
      <Modal.Content>
        <HorizontalLine />
        <p>{t('savedSearches.confirmDelete')}</p>
      </Modal.Content>
      <Modal.Footer>
        <Button className={styles.saveButton} onClick={handleDeleteSearch}>
          {t('word.delete')}
        </Button>
      </Modal.Footer>
    </ModalWithBackdrop>
  );
};

export const SavedSearches = () => {
  const [selectedSavedSearch, setSelectedSavedSearch] = useState<SavedSearchesFieldsFragment>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<SavedSearchesFieldsFragment | false>(false);
  const { t } = useTranslation();
  const { data, isLoading: isLoadingSavedSearches } = useSavedSearches();
  const savedSearches = data?.savedSearches as SavedSearchesFieldsFragment[];

  if (isLoadingSavedSearches) {
    return <SavedSearchesSkeleton numberOfItems={3} />;
  }

  return (
    <main>
      <section className={styles.savedSearchesWrapper}>
        <EditSavedSearch
          key={selectedSavedSearch?.id}
          isOpen={!!selectedSavedSearch}
          savedSearch={selectedSavedSearch}
          onDelete={(savedSearchToDelete: SavedSearchesFieldsFragment) => setIsDeleteModalOpen(savedSearchToDelete)}
          onClose={() => setSelectedSavedSearch(undefined)}
        />
        <DeleteSearchConfirmation
          savedSearch={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          isOpen={!!isDeleteModalOpen}
        />
        <div className={styles.title}>{t('savedSearches.title', { count: savedSearches?.length || 0 })}</div>
        {savedSearches?.length ? (
          <div className={styles.savedSearchesList}>
            {savedSearches?.map((search) => (
              <SavedSearchesItem
                key={search?.id}
                savedSearch={search}
                setSelectedSavedSearch={setSelectedSavedSearch}
                onDelete={(savedSearchToDelete: SavedSearchesFieldsFragment) =>
                  setIsDeleteModalOpen(savedSearchToDelete)
                }
              />
            ))}
          </div>
        ) : (
          t('savedSearches.noSearchesFound')
        )}
        <LastUpdated searches={savedSearches} />
      </section>
    </main>
  );
};

export const useSavedSearches = () => useQuery<SavedSearchesQuery, Error>('savedSearches', fetchSavedSearches);

export const autoFormatRelativeTime = (date: Date, formatDistance: FormatDistanceFunction): string => {
  try {
    const result = formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    });
    return result;
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
      return Number.parseInt(search?.updatedAt!, 10) > Number.parseInt(latest?.updatedAt!, 10) ? search : latest;
    })!.updatedAt;
    return new Date(Number.parseInt(timestamp, 10));
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
  const formatDistance = useFormatDistance();
  if (!searches || !searches?.length) return null;
  const lastUpdated = getMostRecentSearchDate(searches) as Date;

  return (
    <div className={styles.lastUpdated}>
      {t('savedSearches.lastUpdated')}
      {autoFormatRelativeTime(lastUpdated, formatDistance)}
    </div>
  );
};
