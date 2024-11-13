import { BookmarkFillIcon, BookmarkIcon } from '@navikt/aksel-icons';
import { useQueryClient } from '@tanstack/react-query';
import type { SavedSearchData, SavedSearchesFieldsFragment, SearchDataValueFilter } from 'bff-types-generated';
import type { ButtonHTMLAttributes, RefAttributes } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Filter } from '..';
import { useSearchString, useSnackbar } from '..';
import { deleteSavedSearch } from '../../api/queries';
import { useParties } from '../../api/useParties';
import { QUERY_KEYS } from '../../constants/queryKeys';
import { useSavedSearches } from '../../pages/SavedSearches/useSavedSearches';
import { ProfileButton } from '../ProfileButton';
import { deepEqual } from './deepEqual';

const isSearchSavedAlready = (
  savedSearches: SavedSearchesFieldsFragment[],
  searchDataToCheck: SavedSearchData,
): SavedSearchesFieldsFragment | undefined => {
  if (!searchDataToCheck) return undefined;
  return savedSearches.find((s) =>
    Object.keys(searchDataToCheck).every((key) =>
      deepEqual(s.data[key as keyof SavedSearchData], searchDataToCheck[key as keyof SavedSearchData]),
    ),
  );
};

type SaveSearchButtonProps = {
  onBtnClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  activeFilters: Filter[];
} & ButtonHTMLAttributes<HTMLButtonElement> &
  RefAttributes<HTMLButtonElement>;

export const SaveSearchButton = ({
  disabled,
  onBtnClick,
  className,
  isLoading,
  activeFilters,
}: SaveSearchButtonProps) => {
  const { t } = useTranslation();
  const { selectedPartyIds } = useParties();
  const { searchString } = useSearchString();
  const [isDeleting, setIsDeleting] = useState(false);
  const { currentPartySavedSearches: savedSearches } = useSavedSearches(selectedPartyIds);
  const { openSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const searchToCheckIfExistsAlready: SavedSearchData = {
    filters: activeFilters as SearchDataValueFilter[],
    urn: selectedPartyIds as string[],
    searchString,
  };

  const alreadyExistingSavedSearch = isSearchSavedAlready(
    savedSearches ?? ([] as SavedSearchesFieldsFragment[]),
    searchToCheckIfExistsAlready,
  );

  const handleDeleteSearch = async (savedSearchId: number) => {
    setIsDeleting(true);
    try {
      await deleteSavedSearch(savedSearchId);
      openSnackbar({
        message: t('savedSearches.deleted_success'),
        variant: 'success',
      });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_SEARCHES] });
    } catch (error) {
      console.error('Failed to delete saved search:', error);
      openSnackbar({
        message: t('savedSearches.delete_failed'),
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (disabled) {
    return null;
  }

  if (alreadyExistingSavedSearch) {
    return (
      <ProfileButton
        className={className}
        size="xs"
        onClick={() => handleDeleteSearch(alreadyExistingSavedSearch.id)}
        variant="tertiary"
        isLoading={isLoading || isDeleting}
      >
        <BookmarkFillIcon fontSize="1.25rem" />
        {t('filter_bar.saved_search')}
      </ProfileButton>
    );
  }

  return (
    <ProfileButton
      className={className}
      size="xs"
      onClick={onBtnClick}
      variant="tertiary"
      isLoading={isLoading || isDeleting}
    >
      <BookmarkIcon fontSize="1.25rem" />
      {t('filter_bar.save_search')}
    </ProfileButton>
  );
};
