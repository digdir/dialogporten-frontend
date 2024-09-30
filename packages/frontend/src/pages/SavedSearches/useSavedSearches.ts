import { useQuery } from '@tanstack/react-query';
import type { SavedSearchesFieldsFragment, SavedSearchesQuery } from 'bff-types-generated';
import { fetchSavedSearches } from '../../api/queries.ts';
import { QUERY_KEYS } from '../../constants/queryKeys.ts';

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
  const { data, isLoading, isSuccess } = useQuery<SavedSearchesQuery>({
    queryKey: [QUERY_KEYS.SAVED_SEARCHES, selectedPartyIds],
    queryFn: fetchSavedSearches,
    retry: 3,
    staleTime: 1000 * 60 * 20,
  });
  const savedSearchesUnfiltered = data?.savedSearches as SavedSearchesFieldsFragment[];
  const currentPartySavedSearches = filterSavedSearches(savedSearchesUnfiltered, selectedPartyIds || []);
  return { savedSearches: savedSearchesUnfiltered, isLoading, isSuccess, currentPartySavedSearches };
};
