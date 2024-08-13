import type { SavedSearchesQuery } from 'bff-types-generated';
import { useQuery } from 'react-query';
import { fetchSavedSearches } from '../../api/queries.ts';

export const useSavedSearches = () => useQuery<SavedSearchesQuery, Error>('savedSearches', fetchSavedSearches);
