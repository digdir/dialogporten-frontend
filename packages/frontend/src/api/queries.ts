import { HelloQuery, ProfileQuery, getSdk } from 'bff-types-generated';
import { DialogByIdPayload, GetDialogDtoSO } from 'dialogporten-types-generated';
import { GraphQLClient, gql } from 'graphql-request';
import { SavedSearch } from '../pages/SavedSearches';

const graphQLEndpoint = '/api/graphql';
const graphQLClient = new GraphQLClient(graphQLEndpoint, { credentials: 'include' });
const graphQLSDK = getSdk(graphQLClient);

export const getDialogs = (): Promise<GetDialogDtoSO[]> => fetch('/dialogs').then((resp) => resp.json());

export const getSavedSearches = async (): Promise<SavedSearch[]> => {
  return new Promise((resolve) => {
    const historyJSON = localStorage.getItem('searchHistory');
    const history: SavedSearch[] = historyJSON ? JSON.parse(historyJSON) : [];
    resolve(history);
  });
};

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
