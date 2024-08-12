import type { PartiesQuery, PartyFieldsFragment } from 'bff-types-generated';
import { useQuery, useQueryClient } from 'react-query';
import { toTitleCase } from '../profile/name.ts';
import { graphQLSDK } from './queries.ts';

interface UsePartiesOutput {
  parties: PartyFieldsFragment[];
  isSuccess: boolean;
  isLoading: boolean;
  selectedParties: PartyFieldsFragment[];
  setSelectedParties: (parties: PartyFieldsFragment[]) => void;
  setSelectedPartyIds: (parties: string[]) => void;
}

const fetchParties = (): Promise<PartiesQuery> => graphQLSDK.parties();

export const useParties = (): UsePartiesOutput => {
  const queryClient = useQueryClient();
  const { data, isLoading, isSuccess } = useQuery<PartiesQuery>(
    'parties',
    async () => {
      const response = await fetchParties();
      return {
        parties:
          response.parties.map((party) => ({
            ...party,
            name: toTitleCase(party.name),
          })) ?? [],
      };
    },
    {
      onSuccess: (data) => {
        if (!getSelectedParties() && data.parties && data.parties.length > 0) {
          setSelectedParties(data.parties);
        }
      },
    },
  );
  const getSelectedParties = () => queryClient.getQueryData<PartyFieldsFragment[]>('selectedParties');
  const setSelectedParties = (parties: PartyFieldsFragment[] | null) => {
    queryClient.setQueryData('selectedParties', parties);
  };

  const setSelectedPartyIds = (partyIds: string[]) => {
    setSelectedParties(data?.parties.filter((party) => partyIds.includes(party.party)) ?? []);
  };

  return {
    isLoading,
    isSuccess,
    parties: data?.parties ?? ([] as PartyFieldsFragment[]),
    selectedParties: getSelectedParties() ?? ([] as PartyFieldsFragment[]),
    setSelectedParties,
    setSelectedPartyIds,
  };
};
