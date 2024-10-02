import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { PartiesQuery, PartyFieldsFragment } from 'bff-types-generated';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { normalizeFlattenParties } from '../components/PartyDropdown/normalizeFlattenParties.ts';
import { QUERY_KEYS } from '../constants/queryKeys.ts';
import { getSelectedPartyFromQueryParams } from '../pages/Inbox/queryParams.ts';
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
  setAllOrganizationsSelected: (allOrganizations: boolean) => void;
}

interface PartiesResult {
  parties: PartyFieldsFragment[];
  deletedParties: PartyFieldsFragment[];
}

const stripQueryParamsForParty = (searchParamString: string) => {
  const params = new URLSearchParams(searchParamString);
  params.delete('party');
  return params.toString();
};

const fetchParties = (): Promise<PartiesQuery> => graphQLSDK.parties();

export const useParties = (): UsePartiesOutput => {
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPartiesQuery = useQuery<PartyFieldsFragment[]>({
    queryKey: [QUERY_KEYS.SELECTED_PARTIES],
    enabled: false,
    staleTime: Number.POSITIVE_INFINITY,
    initialData: [],
  });

  const { data: allOrganizationsSelected } = useQuery<boolean>({
    queryKey: [QUERY_KEYS.ALL_ORGANIZATIONS_SELECTED],
    enabled: false,
    staleTime: Number.POSITIVE_INFINITY,
    initialData: false,
  });

  const selectedParties = selectedPartiesQuery.data ?? [];

  const { data, isLoading, isSuccess } = useQuery<PartiesResult>({
    queryKey: [QUERY_KEYS.PARTIES],
    queryFn: async () => {
      const response = await fetchParties();
      const normalizedParties = normalizeFlattenParties(response.parties);
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

  const setAllOrganizationsSelected = (allOrganizations: boolean) => {
    queryClient.setQueryData([QUERY_KEYS.ALL_ORGANIZATIONS_SELECTED], allOrganizations);
  };

  const setSelectedPartyIds = (partyIds: string[]) => {
    const isPerson = partyIds[0].includes('person');
    const isMoreThanOneParty = partyIds.length > 1;

    if (isPerson || isMoreThanOneParty) {
      setSearchParams(`?${stripQueryParamsForParty(searchParams.toString())}`, { replace: true });
    } else {
      setSearchParams(
        `?party=${encodeURIComponent(partyIds[0])}&${stripQueryParamsForParty(searchParams.toString())}`,
        { replace: true },
      );
    }
    setSelectedParties(data?.parties.filter((party) => partyIds.includes(party.party)) ?? []);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    if (isSuccess && !selectedParties.length && data?.parties?.length > 0) {
      const selectedPartyIdFromParams = getSelectedPartyFromQueryParams(searchParams);
      const selectedPartyFromQueryParams = data?.parties.find((party) =>
        party.party.includes(selectedPartyIdFromParams),
      );
      const currentEndUser = data?.parties.find((party) => party.isCurrentEndUser);
      if (selectedPartyFromQueryParams) {
        setSelectedPartyIds([selectedPartyFromQueryParams.party]);
      } else if (currentEndUser) {
        setSelectedParties([currentEndUser]);
      } else {
        console.warn('No current end user found, unable to select default parties.');
      }
    }
  }, [isSuccess, selectedParties.length, data?.parties]);

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
    setAllOrganizationsSelected,
  };
};
