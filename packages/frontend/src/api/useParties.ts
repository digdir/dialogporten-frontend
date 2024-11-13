import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { PartiesQuery, PartyFieldsFragment } from 'bff-types-generated';
import { useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { normalizeFlattenParties } from '../components/PartyDropdown/normalizeFlattenParties.ts';
import { QUERY_KEYS } from '../constants/queryKeys.ts';
import { getSelectedAllPartiesFromQueryParams, getSelectedPartyFromQueryParams } from '../pages/Inbox/queryParams.ts';
import { graphQLSDK } from './queries.ts';

interface UsePartiesOutput {
  parties: PartyFieldsFragment[];
  deletedParties: PartyFieldsFragment[];
  isSuccess: boolean;
  isLoading: boolean;
  selectedParties: PartyFieldsFragment[];
  selectedPartyIds: string[];
  setSelectedParties: (parties: PartyFieldsFragment[]) => void;
  setSelectedPartyIds: (parties: string[], allOrganizationsSelected: boolean) => void;
  currentEndUser: PartyFieldsFragment | undefined;
  allOrganizationsSelected: boolean;
  selectedProfile: 'company' | 'person';
}

interface PartiesResult {
  parties: PartyFieldsFragment[];
  deletedParties: PartyFieldsFragment[];
}

const stripQueryParamsForParty = (searchParamString: string) => {
  const params = new URLSearchParams(searchParamString);
  params.delete('party');
  params.delete('allParties');
  return params.toString();
};

const fetchParties = (): Promise<PartiesQuery> => graphQLSDK.parties();

const setAllPartiesParam = (searchParamString: string) => {
  const params = new URLSearchParams(searchParamString);
  params.set('allParties', 'true');
  return params.toString();
};

export const useParties = (): UsePartiesOutput => {
  const queryClient = useQueryClient();
  const location = useLocation();
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

  const setSelectedPartyIds = (partyIds: string[], allOrganizationsSelected: boolean) => {
    setAllOrganizationsSelected(allOrganizationsSelected);
    const isPerson = partyIds[0].includes('person');
    if (allOrganizationsSelected) {
      setSearchParams(setAllPartiesParam(searchParams.toString()), { replace: true });
    } else if (isPerson) {
      setSearchParams(stripQueryParamsForParty(searchParams.toString()), { replace: true });
    } else {
      const newSearchParams = new URLSearchParams(stripQueryParamsForParty(searchParams.toString()));
      newSearchParams.append('party', encodeURIComponent(partyIds[0]));
      setSearchParams(newSearchParams, { replace: true });
    }
    setSelectedParties(data?.parties.filter((party) => partyIds.includes(party.party)) ?? []);
  };

  const selectAllOrganizations = () => {
    const allOrgParties =
      data?.parties?.filter((party) => party.party.includes('organization')).map((party) => party.party) ?? [];
    setSelectedPartyIds(allOrgParties, true);
  };

  const selectSpecificParty = () => {
    const partyFromQuery = getSelectedPartyFromQueryParams(searchParams);
    return partyFromQuery && data?.parties?.find((party) => party.party.includes(partyFromQuery));
  };

  const selectCurrentEndUser = () => {
    return data?.parties?.find((party) => party.isCurrentEndUser);
  };

  const handlePartySelection = () => {
    if (getSelectedAllPartiesFromQueryParams(searchParams)) {
      selectAllOrganizations();
    } else {
      const selectedParty = selectSpecificParty();
      const currentEndUser = selectCurrentEndUser();

      if (selectedParty) {
        setSelectedPartyIds([selectedParty.party], false);
      } else if (currentEndUser) {
        setSelectedPartyIds([currentEndUser.party], false);
      } else {
        console.warn('No current end user found, unable to select default parties.');
      }
    }
  };

  const isCompanyFromParams = useMemo(() => {
    const party = searchParams.get('party');
    const allParties = searchParams.get('allParties');
    return Boolean(party || allParties);
  }, [searchParams]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    if (isSuccess && data?.parties?.length > 0) {
      handlePartySelection();
    }
  }, [isSuccess, data?.parties, location.search]);

  const isCompanyProfile =
    isCompanyFromParams || allOrganizationsSelected || selectedParties?.[0]?.partyType === 'Organization';

  const selectedProfile = (isCompanyProfile ? 'company' : 'person') as 'company' | 'person';

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
    selectedProfile,
  };
};
