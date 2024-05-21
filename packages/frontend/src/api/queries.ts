import { GraphQLClient } from 'graphql-request';
import { dialogs } from '../mocks/dialogs.tsx';
import { HelloQuery, ProfileQuery, getSdk, SavedSearchesQuery, DeleteSavedSearchMutation, UpdateSavedSearchMutation, CreateSavedSearchMutation, SavedSearchInput } from 'bff-types-generated';

const graphQLEndpoint = '/api/graphql';
const graphQLClient = new GraphQLClient(graphQLEndpoint, { credentials: 'include' });
export const graphQLSDK = getSdk(graphQLClient);

export const getDialogs = (): Promise<typeof dialogs> => fetch('/dialogs').then((resp) => resp.json());

export const fetchHelloWorld = (): Promise<HelloQuery> => graphQLSDK.hello();

export const fetchProfile = (): Promise<ProfileQuery> => graphQLSDK.profile();
export const fetchSavedSearches = (): Promise<SavedSearchesQuery> => graphQLSDK.savedSearches();
export const deleteSavedSearch = (id: number): Promise<DeleteSavedSearchMutation> => graphQLSDK.DeleteSavedSearch({ id });
export const updateSavedSearch = (id: number, name: string): Promise<UpdateSavedSearchMutation> => graphQLSDK.UpdateSavedSearch({ id, name });
export const createSavedSearch = (name: string, data: SavedSearchInput): Promise<CreateSavedSearchMutation> => graphQLSDK.CreateSavedSearch({ name, data });
