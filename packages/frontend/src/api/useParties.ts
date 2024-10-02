import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { PartiesQuery, PartyFieldsFragment } from 'bff-types-generated';
import { useEffect, useMemo } from 'react';
import { normalizeParties } from '../components/PartyDropdown/normalizeParties.ts';
import { QUERY_KEYS } from '../constants/queryKeys.ts';
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

  const selectedPartiesQuery = useQuery<PartyFieldsFragment[]>({
    queryKey: [QUERY_KEYS.SELECTED_PARTIES],
    enabled: false,
    staleTime: Number.POSITIVE_INFINITY,
    initialData: [],
  });

  const selectedParties = selectedPartiesQuery.data ?? [];

  const { data, isLoading, isSuccess } = useQuery<PartiesResult>({
    queryKey: [QUERY_KEYS.PARTIES],
    queryFn: async () => {
      const response = await fetchParties();
      const normalizedParties = normalizeParties(response.parties);
      return {
        parties: normalizedParties.filter((party) => !party.isDeleted),
        deletedParties: normalizedParties.filter((party) => party.isDeleted),
      };
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  const setSelectedParties = (parties: PartyFieldsFragment[] | null) => {
    if (parties?.length) {
      queryClient.setQueryData([QUERY_KEYS.SELECTED_PARTIES], parties);
    }
  };

  const setSelectedPartyIds = (partyIds: string[]) => {
    setSelectedParties(data?.parties.filter((party) => partyIds.includes(party.party)) ?? []);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    if (isSuccess && !selectedParties.length && data?.parties?.length > 0) {
      const currentEndUser = data.parties.find((party) => party.isCurrentEndUser);
      if (currentEndUser) {
        setSelectedParties([currentEndUser]);
      } else {
        console.warn('No current end user found, unable to select default parties.');
      }
    }
  }, [isSuccess, selectedParties.length, data?.parties]);

  const allOrganizationsSelected = useMemo(() => {
    const allOrgParties = data?.parties.filter((party) => party.partyType === 'Organization') ?? [];
    const selectedOrgParties = selectedParties.filter((party) => party.partyType === 'Organization');

    const allOrgPartyIds = new Set(allOrgParties.map((party) => party.party));
    const selectedOrgPartyIds = new Set(selectedOrgParties.map((party) => party.party));

    return (
      selectedOrgParties.length >= 2 &&
      allOrgPartyIds.size === selectedOrgPartyIds.size &&
      [...selectedOrgPartyIds].every((id) => allOrgPartyIds.has(id))
    );
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
