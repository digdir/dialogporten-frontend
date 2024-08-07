import type { SavedSearchesFieldsFragment, SavedSearchesQuery } from 'bff-types-generated';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { fetchSavedSearches } from '../../api/queries';
import { useFormatDistance } from '../../i18n/useDateFnsLocale.tsx';
import { ConfirmDeleteDialog, type DeleteSearchDialogRef } from './ConfirmDeleteDialog/ConfirmDeleteDialog.tsx';
import {
  EditSavedSearchDialog,
  type EditSavedSearchDialogRef,
} from './EditSavedSearchDialog/EditSavedSearchDialog.tsx';
import { SaveSearchesActions } from './SavedSearchesActions/SavedSearchesActions.tsx';
import { SavedSearchesItem } from './SavedSearchesItem/SavedSearchesItem.tsx';
import { SavedSearchesSkeleton } from './SavedSearchesSkeleton';
import styles from './savedSearchesPage.module.css';
import { autoFormatRelativeTime, getMostRecentSearchDate } from './searchUtils.ts';

export const useSavedSearches = () => useQuery<SavedSearchesQuery, Error>('savedSearches', fetchSavedSearches);

export const SavedSearchesPage = () => {
  const [selectedSavedSearch, setSelectedSavedSearch] = useState<SavedSearchesFieldsFragment | null>(null);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState<number | undefined>(undefined);
  const { t } = useTranslation();
  const { data, isLoading: isLoadingSavedSearches } = useSavedSearches();
  const savedSearches = data?.savedSearches as SavedSearchesFieldsFragment[];
  const deleteDialogRef = useRef<DeleteSearchDialogRef>(null);
  const editSavedSearchDialogRef = useRef<EditSavedSearchDialogRef>(null);
  const formatDistance = useFormatDistance();
  const lastUpdated = getMostRecentSearchDate(savedSearches ?? []) as Date;

  if (isLoadingSavedSearches) {
    return <SavedSearchesSkeleton numberOfItems={3} />;
  }

  if (!savedSearches?.length) {
    return (
      <main>
        <section className={styles.savedSearchesWrapper}>
          <div className={styles.title}>{t('savedSearches.title', { count: 0 })}</div>
          <span>{t('savedSearches.noSearchesFound')}</span>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className={styles.savedSearchesWrapper}>
        <div className={styles.title}>{t('savedSearches.title', { count: savedSearches.length })}</div>
        <div className={styles.savedSearchesList}>
          {savedSearches.map((savedSearch, index) => (
            <SavedSearchesItem
              key={savedSearch?.id}
              savedSearch={savedSearch}
              isLast={index === savedSearches.length - 1}
              actionPanel={
                <SaveSearchesActions
                  key={savedSearch.id}
                  onEditBtnClick={(selectedValue: SavedSearchesFieldsFragment) => {
                    setSelectedSavedSearch(selectedValue);
                    editSavedSearchDialogRef.current?.openDialog();
                  }}
                  onDeleteBtnClick={(savedSearchToDelete: SavedSearchesFieldsFragment) => {
                    setSelectedDeleteItem(savedSearchToDelete.id);
                    deleteDialogRef.current?.openDialog();
                  }}
                  savedSearch={savedSearch}
                />
              }
            />
          ))}
        </div>
        <div className={styles.lastUpdated}>
          {t('savedSearches.lastUpdated')}
          {autoFormatRelativeTime(lastUpdated, formatDistance)}
        </div>
      </section>
      <EditSavedSearchDialog
        ref={editSavedSearchDialogRef}
        savedSearch={selectedSavedSearch}
        onDelete={(savedSearchToDelete: SavedSearchesFieldsFragment) => {
          editSavedSearchDialogRef?.current?.close();
          setSelectedDeleteItem(savedSearchToDelete.id);
          deleteDialogRef.current?.openDialog();
        }}
      />
      <ConfirmDeleteDialog ref={deleteDialogRef} savedSearchId={selectedDeleteItem} />
    </main>
  );
};
