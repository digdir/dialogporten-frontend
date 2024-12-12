import { useQueryClient } from '@tanstack/react-query';
import type {
  PartyFieldsFragment,
  SavedSearchData,
  SavedSearchesFieldsFragment,
  SearchDataValueFilter,
} from 'bff-types-generated';
import { type Dispatch, type SetStateAction, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSavedSearch } from '../../api/queries.ts';
import type { InboxViewType } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { type Filter, PartyDropdown, useSnackbar } from '../../components';
import { QUERY_KEYS } from '../../constants/queryKeys.ts';
import { useFormatDistance } from '../../i18n/useDateFnsLocale.tsx';
import { Routes } from '../Inbox/Inbox.tsx';
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
import { useSavedSearches } from './useSavedSearches.ts';

interface HandleSaveSearchProps {
  activeFilters: Filter[];
  selectedParties: PartyFieldsFragment[];
  enteredSearchValue: string;
  viewType: InboxViewType;
  setIsSavingSearch: Dispatch<SetStateAction<boolean>>;
}

export const handleSaveSearch = async ({
  activeFilters,
  selectedParties,
  enteredSearchValue,
  viewType,
  setIsSavingSearch,
}: HandleSaveSearchProps): Promise<void> => {
  const { t } = useTranslation();
  const { openSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  try {
    const data: SavedSearchData = {
      filters: activeFilters as SearchDataValueFilter[],
      urn: selectedParties.map((party) => party.party) as string[],
      searchString: enteredSearchValue,
      fromView: Routes[viewType],
    };
    setIsSavingSearch(true);
    await createSavedSearch('', data);
    openSnackbar({
      message: t('savedSearches.saved_success'),
      variant: 'success',
    });
  } catch (error) {
    openSnackbar({
      message: t('savedSearches.saved_error'),
      variant: 'error',
    });
    console.error('Error creating saved search: ', error);
  } finally {
    setIsSavingSearch(false);
    void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_SEARCHES] });
  }
};

export const SavedSearchesPage = () => {
  const [selectedSavedSearch, setSelectedSavedSearch] = useState<SavedSearchesFieldsFragment | null>(null);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState<number | undefined>(undefined);
  const { t } = useTranslation();
  const { selectedPartyIds } = useParties();
  const { currentPartySavedSearches: savedSearches, isLoading: isLoadingSavedSearches } =
    useSavedSearches(selectedPartyIds);
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
        <section className={styles.filtersArea}>
          <div className={styles.gridContainer}>
            <div className={styles.filterSaveContainer}>
              <PartyDropdown counterContext="saved-searches" />
            </div>
          </div>
        </section>
        <section className={styles.savedSearchesWrapper}>
          <div className={styles.title}>{t('savedSearches.title', { count: 0 })}</div>
          <span>{t('savedSearches.noSearchesFound')}</span>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className={styles.filtersArea}>
        <div className={styles.gridContainer}>
          <div className={styles.filterSaveContainer}>
            <PartyDropdown counterContext="saved-searches" />
          </div>
        </div>
      </section>
      <section>
        <div className={styles.savedSearchesWrapper}>
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
