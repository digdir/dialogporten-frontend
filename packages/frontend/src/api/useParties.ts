import { PartiesQuery, PartyFieldsFragment } from 'bff-types-generated';
import { useQuery, useQueryClient } from 'react-query';
import { graphQLSDK } from './queries.ts';

interface UsePartiesOutput {
  parties: PartyFieldsFragment[];
  isSuccess: boolean;
  isLoading: boolean;
  selectedParties: PartyFieldsFragment[];
  setSelectedParties: (parties: PartyFieldsFragment[]) => void;
  isAllOrganizationsSelected: boolean;
}

const fetchParties = (): Promise<PartiesQuery> => graphQLSDK.parties();

export const useParties = (): UsePartiesOutput => {
  const queryClient = useQueryClient();
  const getSelectedParties = () => queryClient.getQueryData<PartyFieldsFragment[]>('selectedParties');
  const setSelectedParties = (parties: PartyFieldsFragment[] | null) => {
    queryClient.setQueryData('selectedParties', parties);
  };
  const { data, isLoading, isSuccess } = useQuery<PartiesQuery>('parties', fetchParties, {
    onSuccess: (data) => {
      if (!getSelectedParties() && data.parties && data.parties.length > 0) {
        setSelectedParties(data.parties);
      }
    }
  });
  const isAllOrganizationsSelected = (data?.parties ?? []).every((party) => party.partyType === 'Organization');

  return {
    isLoading,
    isSuccess,
    parties: data?.parties ?? ([] as PartyFieldsFragment[]),
    selectedParties: getSelectedParties() ?? ([] as PartyFieldsFragment[]),
    setSelectedParties,
    isAllOrganizationsSelected
  };
};
