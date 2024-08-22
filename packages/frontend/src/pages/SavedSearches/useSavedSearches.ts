import type { PartyFieldsFragment, SavedSearchesFieldsFragment, SavedSearchesQuery } from 'bff-types-generated';
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
  selectedParties: PartyFieldsFragment[],
): SavedSearchesFieldsFragment[] => {
  return (savedSearches ?? []).filter((savedSearch) => {
    if (!savedSearch?.data.urn?.length) {
      return true;
    }
    if (selectedParties?.length !== savedSearch?.data?.urn?.length) {
      return false;
    }

    return selectedParties?.every((party) => savedSearch?.data?.urn?.includes(party.party));
  });
};

export const useSavedSearches = (selectedParties?: PartyFieldsFragment[]): UseSavedSearchesOutput => {
  const { data, isLoading, isSuccess } = useQuery<SavedSearchesQuery>('savedSearches', fetchSavedSearches);
  const savedSearchesUnfiltered = data?.savedSearches as SavedSearchesFieldsFragment[];
  const currentPartySavedSearches = filterSavedSearches(savedSearchesUnfiltered, selectedParties || []);
  return { savedSearches: savedSearchesUnfiltered, isLoading, isSuccess, currentPartySavedSearches };
};
