import type { SavedSearchesFieldsFragment, SavedSearchesQuery } from 'bff-types-generated';
import { useQuery } from 'react-query';
import { fetchSavedSearches } from '../../api/queries.ts';

interface UseSavedSearchesOutput {
  savedSearches: SavedSearchesFieldsFragment[];
  isSuccess: boolean;
  isLoading: boolean;
  currentPartySavedSearches: SavedSearchesFieldsFragment[] | undefined;
}

export const filterSavedSearches = (
  savedSearches: SavedSearchesFieldsFragment[],
  selectedPartyIds: string[],
): SavedSearchesFieldsFragment[] => {
  return (savedSearches ?? []).filter((savedSearch) => {
    if (!savedSearch?.data.urn?.length) {
      return true;
    }

    if (savedSearch?.data?.urn?.length > 0) {
      return selectedPartyIds.includes(savedSearch?.data.urn[0]!);
    }

    if (selectedPartyIds?.length !== savedSearch?.data?.urn?.length) {
      return false;
    }

    return selectedPartyIds?.every((party) => savedSearch?.data?.urn?.includes(party));
  });
};

export const useSavedSearches = (selectedPartyIds?: string[]): UseSavedSearchesOutput => {
  const { data, isLoading, isSuccess } = useQuery<SavedSearchesQuery>(
    ['savedSearches', selectedPartyIds],
    fetchSavedSearches,
  );
  const savedSearchesUnfiltered = data?.savedSearches as SavedSearchesFieldsFragment[];
  const currentPartySavedSearches = filterSavedSearches(savedSearchesUnfiltered, selectedPartyIds || []);
  return { savedSearches: savedSearchesUnfiltered, isLoading, isSuccess, currentPartySavedSearches };
};
