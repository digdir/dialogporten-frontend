import type { PartyFieldsFragment, SavedSearchesFieldsFragment, SavedSearchesQuery } from 'bff-types-generated';
import { useQuery } from 'react-query';
import { fetchSavedSearches } from '../../api/queries.ts';

interface UseSavedSearchesOutput {
  savedSearches: SavedSearchesFieldsFragment[];
  isSuccess: boolean;
  isLoading: boolean;
  currentPartySavedSearches: SavedSearchesFieldsFragment[] | undefined;
}

export const useSavedSearches = (currentParty?: PartyFieldsFragment): UseSavedSearchesOutput => {
  const { data, isLoading, isSuccess } = useQuery<SavedSearchesQuery>('savedSearches', fetchSavedSearches);
  const savedSearchesUnfiltered = data?.savedSearches as SavedSearchesFieldsFragment[];
  const currentPartySavedSearches =
    currentParty && savedSearchesUnfiltered?.filter((savedSearch) => savedSearch?.data?.urn === currentParty.party);

  return { savedSearches: savedSearchesUnfiltered, isLoading, isSuccess, currentPartySavedSearches };
};
