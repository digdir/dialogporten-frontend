import { BookmarkFillIcon, BookmarkIcon } from '@navikt/aksel-icons';
import type { SavedSearchData, SavedSearchesFieldsFragment, SearchDataValueFilter } from 'bff-types-generated';
import { type ButtonHTMLAttributes, type RefAttributes, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { type Filter, useSearchString } from '..';
import { useParties } from '../../api/useParties';
import {
  ConfirmDeleteDialog,
  type DeleteSearchDialogRef,
} from '../../pages/SavedSearches/ConfirmDeleteDialog/ConfirmDeleteDialog';
import { useSavedSearches } from '../../pages/SavedSearches/useSavedSearches';
import { ProfileButton } from '../ProfileButton';

type IndexedObject = { [key: string]: unknown };

function deepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  const obj1Typed = obj1 as IndexedObject;
  const obj2Typed = obj2 as IndexedObject;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1Typed[key], obj2Typed[key])) {
      return false;
    }
  }

  return true;
}

const isSearchSavedAlready = (
  savedSearches: SavedSearchesFieldsFragment[],
  searchDataToCheck: SavedSearchData,
): SavedSearchesFieldsFragment | undefined => {
  if (!searchDataToCheck) return undefined;
  let retValue: SavedSearchesFieldsFragment | undefined = undefined;
  savedSearches.some((s) => {
    const savedSearch = s.data;
    return Object.keys(searchDataToCheck).every((key) => {
      const isEqual = deepEqual(
        savedSearch[key as keyof SavedSearchData],
        searchDataToCheck[key as keyof SavedSearchData],
      );
      if (isEqual) retValue = s;
      return isEqual;
    });
  });
  return retValue || undefined;
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
  const { currentPartySavedSearches: savedSearches } = useSavedSearches(selectedPartyIds);
  const searchToCheckIfExistsAlready: SavedSearchData = {
    filters: activeFilters as SearchDataValueFilter[],
    urn: selectedPartyIds as string[],
    searchString,
  };
  const alreadyExistingSavedSearch = isSearchSavedAlready(
    savedSearches ?? ([] as SavedSearchesFieldsFragment[]),
    searchToCheckIfExistsAlready,
  );
  const deleteDialogRef = useRef<DeleteSearchDialogRef>(null);

  if (disabled) {
    return null;
  }

  return (
    <>
      <ProfileButton className={className} size="xs" onClick={onBtnClick} variant="tertiary" isLoading={isLoading}>
        {alreadyExistingSavedSearch ? <BookmarkFillIcon fontSize="1.25rem" /> : <BookmarkIcon fontSize="1.25rem" />}{' '}
        {t('filter_bar.save_search')}
      </ProfileButton>
      <ConfirmDeleteDialog ref={deleteDialogRef} savedSearchId={alreadyExistingSavedSearch?.id} />
    </>
  );
};
