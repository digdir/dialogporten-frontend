import type { PartiesQuery, PartyFieldsFragment } from 'bff-types-generated';
import { useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { toTitleCase } from '../profile';
import { graphQLSDK } from './queries.ts';

interface UsePartiesOutput {
  parties: PartyFieldsFragment[];
  deletedParties: PartyFieldsFragment[];
  isSuccess: boolean;
  isLoading: boolean;
  selectedParties: PartyFieldsFragment[];
  selectedPartyIds: string[];
  setSelectedParties: (parties: PartyFieldsFragment[]) => void;
  setSelectedPartyIds: (parties: string[]) => void;
  currentEndUser: PartyFieldsFragment | undefined;
  allOrganizationsSelected: boolean;
}

interface PartiesResult {
  parties: PartyFieldsFragment[];
  deletedParties: PartyFieldsFragment[];
}

const fetchParties = (): Promise<PartiesQuery> => graphQLSDK.parties();

export const useParties = (): UsePartiesOutput => {
  const queryClient = useQueryClient();
  const { data: selectedParties = [] } = useQuery<PartyFieldsFragment[]>(['selectedParties'], {
    enabled: false,
    staleTime: Number.POSITIVE_INFINITY,
    initialData: [],
  });
  const { data, isLoading, isSuccess } = useQuery<PartiesResult>(
    'parties',
    async () => {
      const response = await fetchParties();
      const partiesWithNormalizedNames =
        response.parties.map((party) => ({
          ...party,
          name: toTitleCase(party.name),
        })) ?? [];
      return {
        parties: partiesWithNormalizedNames.filter((party) => !party.isDeleted),
        deletedParties: partiesWithNormalizedNames.filter((party) => party.isDeleted),
      };
    },
    {
      cacheTime: Number.POSITIVE_INFINITY,
      onSuccess: (data: PartiesResult) => {
        if (!selectedParties.length && data?.parties?.length > 0) {
          const currentEndUser = data.parties.find((party) => party.isCurrentEndUser);
          if (currentEndUser) {
            setSelectedParties([currentEndUser]);
          } else {
            console.warn('No current end user found, unable to select default parties.');
          }
        }
      },
    },
  );

  const setSelectedParties = (parties: PartyFieldsFragment[] | null) => {
    if (parties?.length) {
      queryClient.setQueryData('selectedParties', parties);
    }
  };

  const setSelectedPartyIds = (partyIds: string[]) => {
    setSelectedParties(data?.parties.filter((party) => partyIds.includes(party.party)) ?? []);
  };

  const allOrganizationsSelected = useMemo(() => {
    const allOrgParties = data?.parties.filter((party) => party.partyType === 'Organization') ?? [];
    const selectedOrgParties = selectedParties.filter((party) => party.partyType === 'Organization');

    return selectedOrgParties.length > 0 && allOrgParties.length === selectedOrgParties.length;
  }, [selectedParties, data]);

  return {
    isLoading,
    isSuccess,
    selectedParties,
    selectedPartyIds: selectedParties.map((party) => party.party) ?? [],
    setSelectedParties,
    setSelectedPartyIds,
    parties: data?.parties ?? [],
    currentEndUser: data?.parties.find((party) => party.isCurrentEndUser),
    deletedParties: data?.deletedParties ?? [],
    allOrganizationsSelected,
  };
};
