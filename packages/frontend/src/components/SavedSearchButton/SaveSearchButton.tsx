import { BookmarkFillIcon, BookmarkIcon } from '@navikt/aksel-icons';
import type { SavedSearchData, SavedSearchesFieldsFragment, SearchDataValueFilter } from 'bff-types-generated';
import type { ButtonHTMLAttributes, RefAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import type { Filter } from '..';
import type { InboxViewType } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties';
import { useSavedSearches } from '../../pages/SavedSearches/useSavedSearches';
import { useSearchString } from '../PageLayout/Search';
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
  disabled?: boolean;
  viewType: InboxViewType;
  activeFilters: Filter[];
} & ButtonHTMLAttributes<HTMLButtonElement> &
  RefAttributes<HTMLButtonElement>;

export const SaveSearchButton = ({ disabled, className, activeFilters, viewType }: SaveSearchButtonProps) => {
  const { t } = useTranslation();
  const { selectedPartyIds } = useParties();
  const { enteredSearchValue } = useSearchString();
  const {
    currentPartySavedSearches: savedSearches,
    isCTALoading,
    saveSearch,
    deleteSearch,
  } = useSavedSearches(selectedPartyIds);

  const searchToCheckIfExistsAlready: SavedSearchData = {
    filters: activeFilters as SearchDataValueFilter[],
    urn: selectedPartyIds as string[],
    searchString: enteredSearchValue,
  };

  const alreadyExistingSavedSearch = isSearchSavedAlready(
    savedSearches ?? ([] as SavedSearchesFieldsFragment[]),
    searchToCheckIfExistsAlready,
  );

  if (disabled) {
    return null;
  }

  if (alreadyExistingSavedSearch) {
    return (
      <ProfileButton
        className={className}
        size="xs"
        onClick={() => deleteSearch(alreadyExistingSavedSearch.id)}
        variant="tertiary"
        isLoading={isCTALoading}
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
      onClick={() =>
        saveSearch({ filters: activeFilters, selectedParties: selectedPartyIds, enteredSearchValue, viewType })
      }
      variant="tertiary"
      isLoading={isCTALoading}
    >
      <BookmarkIcon fontSize="1.25rem" />
      {t('filter_bar.save_search')}
    </ProfileButton>
  );
};
