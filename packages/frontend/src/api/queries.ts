import { HelloQuery, ProfileQuery, getSdk } from 'bff-types-generated';
import { DialogByIdPayload, GetDialogDtoSO } from 'dialogporten-types-generated';
import { GraphQLClient, gql } from 'graphql-request';
import { SavedSearchDTO } from '../pages/SavedSearches';
import axios from 'axios';

const graphQLEndpoint = '/api/graphql';
const graphQLClient = new GraphQLClient(graphQLEndpoint, { credentials: 'include' });
const graphQLSDK = getSdk(graphQLClient);

export const getDialogs = (): Promise<GetDialogDtoSO[]> => fetch('/dialogs').then((resp) => resp.json());

export const getSavedSearches = (): Promise<SavedSearchDTO[]> =>
  axios.get<SavedSearchDTO[]>('/api/saved-search').then((response) => response.data);

export const fetchHelloWorld = (): Promise<HelloQuery> => graphQLSDK.hello();

export const fetchProfile = (): Promise<ProfileQuery> => graphQLSDK.profile();

/* This will be replaced as soon as both BFF and Dialogporten schemas er stichted together */
export const fetchDialogByIdExample = (dialogId: string): Promise<DialogByIdPayload> => {
  /* temporary endpoint forwarding request to Dialogporten */
  const graphQLEndpoint = '/api/test';
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
