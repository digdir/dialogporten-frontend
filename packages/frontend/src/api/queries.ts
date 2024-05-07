import { DialogByIdPayload } from 'dialogporten-types-generated';
import { GraphQLClient, gql } from 'graphql-request';
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

/* This will be replaced as soon as both BFF and Dialogporten schemas er stichted together */
export const fetchDialogByIdExample = (dialogId: string): Promise<DialogByIdPayload> => {
  /* temporary endpoint forwarding request to Dialogporten */
  const graphQLEndpoint = '/api/graphql';
  const graphQLClient = new GraphQLClient(graphQLEndpoint);
  const document = gql`
  query DialogById($id: UUID!) {
    dialogById(dialogId: $id) {
      dialog {
        status
      }
    }
  }
`;
  return graphQLClient.request(document, { id: dialogId });
};
