import {
  type CreateSavedSearchMutation,
  type DeleteSavedSearchMutation,
  type SavedSearchInput,
  type SavedSearchesQuery,
  type UpdateSavedSearchMutation,
  getSdk,
} from 'bff-types-generated';
import { GraphQLClient } from 'graphql-request';

export const graphQLSDK = getSdk(new GraphQLClient('/api/graphql', { credentials: 'include' }));
export const profile = graphQLSDK.profile;
export const fetchSavedSearches = (): Promise<SavedSearchesQuery> => graphQLSDK.savedSearches();
export const deleteSavedSearch = (id: number): Promise<DeleteSavedSearchMutation> =>
  graphQLSDK.DeleteSavedSearch({ id });
export const updateSavedSearch = (id: number, name: string): Promise<UpdateSavedSearchMutation> =>
  graphQLSDK.UpdateSavedSearch({ id, name });
export const createSavedSearch = (name: string, data: SavedSearchInput): Promise<CreateSavedSearchMutation> =>
  graphQLSDK.CreateSavedSearch({ name, data });
