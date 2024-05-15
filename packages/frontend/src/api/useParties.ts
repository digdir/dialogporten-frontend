import { PartiesQuery, PartyFieldsFragment } from 'bff-types-generated';
import { useQuery } from 'react-query';
import { graphQLSDK } from './queries.ts';

interface UsePartiesOutput {
  parties: PartyFieldsFragment[];
  isSuccess: boolean;
  isLoading: boolean;
}

const fetchParties = (): Promise<PartiesQuery> => graphQLSDK.parties();

export const useParties = (): UsePartiesOutput => {
  const { data, isLoading, isSuccess } = useQuery<PartiesQuery>('parties', fetchParties);
  return {
    isLoading,
    isSuccess,
    parties: data?.parties ?? ([] as PartyFieldsFragment[]),
  };
};
