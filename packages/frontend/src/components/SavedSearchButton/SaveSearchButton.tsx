import { BookmarkFillIcon, BookmarkIcon } from '@navikt/aksel-icons';
import type { SavedSearchData, SearchDataValueFilter } from 'bff-types-generated';
import type { ButtonHTMLAttributes, RefAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import type { Filter } from '..';
import type { InboxViewType } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties';
import { useSavedSearches } from '../../pages/SavedSearches/useSavedSearches';
import { useSearchString } from '../PageLayout/Search';
import { ProfileButton } from '../ProfileButton';
import { getAlreadySavedSearch } from './alreadySaved.ts';

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

  const alreadySavedSearch = getAlreadySavedSearch(searchToCheckIfExistsAlready, savedSearches);

  if (disabled) {
    return null;
  }

  if (alreadySavedSearch) {
    return (
      <ProfileButton
        className={className}
        size="xs"
        onClick={() => deleteSearch(alreadySavedSearch.id)}
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
