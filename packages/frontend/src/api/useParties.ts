import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { PartyFieldsFragment } from 'bff-types-generated';
import { useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { QUERY_KEYS } from '../constants/queryKeys.ts';
import { getSelectedAllPartiesFromQueryParams, getSelectedPartyFromQueryParams } from '../pages/Inbox/queryParams.ts';
import { normalizeFlattenParties } from './normalizeFlattenParties.ts';
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
  partiesEmptyList: boolean;
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

const fetchParties = async (): Promise<PartiesResult> => {
  const response = await graphQLSDK.parties();
  const normalizedParties = normalizeFlattenParties(response.parties);
  return {
    parties: normalizedParties.filter((party) => !party.isDeleted),
    deletedParties: normalizedParties.filter((party) => party.isDeleted),
  };
};

const createPartyParams = (searchParamString: string, key: string, value: string): URLSearchParams => {
  const params = new URLSearchParams(searchParamString);
  params.delete('allParties');
  params.delete('party');
  params.set(key, value);
  return params;
};

export const useParties = (): UsePartiesOutput => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangSearchParams = (searchParams: URLSearchParams) => {
    /* Avoid setting search params if they are the same as the current ones */
    if (searchParams.toString() !== new URLSearchParams(location.search).toString()) {
      setSearchParams(searchParams, { replace: true });
    }
  };

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

  const { data: partiesEmptyList } = useQuery<boolean>({
    queryKey: [QUERY_KEYS.PARTIES_EMPTY_LIST],
    enabled: false,
    staleTime: Number.POSITIVE_INFINITY,
    initialData: false,
  });

  const selectedParties = selectedPartiesQuery.data ?? [];

  const { data, isLoading, isSuccess } = useQuery<PartiesResult>({
    queryKey: [QUERY_KEYS.PARTIES],
    queryFn: fetchParties,
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
    const partyIsPerson = partyIds.some((partyId) => partyId.includes('person'));
    const searchParamsString = searchParams.toString();
    if (allOrganizationsSelected) {
      const allPartiesParams = createPartyParams(searchParamsString, 'allParties', 'true');
      handleChangSearchParams(allPartiesParams);
    } else if (partyIsPerson) {
      /* We need to exclude person from URL because it contains information we don't want to expose in the URL.
       * However, if current end user has multiple parties of type person, we need to resolve to current end (user logged in)
       * user party from URL.
       */
      const personParams = new URLSearchParams(stripQueryParamsForParty(searchParamsString));
      handleChangSearchParams(personParams);
    } else {
      const params = createPartyParams(searchParamsString, 'party', encodeURIComponent(partyIds[0]));
      handleChangSearchParams(params);
    }
    setSelectedParties(data?.parties.filter((party) => partyIds.includes(party.party)) ?? []);
  };

  const selectAllOrganizations = () => {
    const allOrgParties =
      data?.parties?.filter((party) => party.party.includes('organization')).map((party) => party.party) ?? [];
    setSelectedPartyIds(allOrgParties, true);
  };

  const getPartyFromURL = () => {
    const partyFromQuery = getSelectedPartyFromQueryParams(searchParams);
    if (partyFromQuery) {
      return data?.parties?.find((party) => party.party === partyFromQuery);
    }
  };

  const getEndUserParty = () => {
    return data?.parties?.find((party) => party.isCurrentEndUser);
  };

  const handlePartySelection = () => {
    if (getSelectedAllPartiesFromQueryParams(searchParams)) {
      selectAllOrganizations();
    } else {
      const orgFromURL = getPartyFromURL();
      const currentEndUser = getEndUserParty();
      const selectedPartyIsPerson = selectedParties.some((party) => party.party.includes('person'));
      if (orgFromURL) {
        setSelectedPartyIds([orgFromURL.party], false);
      } else if (selectedPartyIsPerson) {
        setSelectedPartyIds(
          selectedParties.map((party) => party.party),
          false,
        );
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
    if (isSuccess) {
      if (data?.parties?.length > 0) {
        handlePartySelection();
      } else {
        queryClient.setQueryData([QUERY_KEYS.PARTIES_EMPTY_LIST], true);
      }
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
    partiesEmptyList,
  };
};
