import { useQuery } from '@tanstack/react-query';
import type { DialogStatus, GetAllDialogsForPartiesQuery, PartyFieldsFragment } from 'bff-types-generated';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { mapDialogDtoToInboxItem, searchDialogs } from '../../../api/useDialogs.tsx';
import { QUERY_KEYS } from '../../../constants/queryKeys.ts';
import { useOrganizations } from '../../../pages/Inbox/useOrganizations.ts';
import type { InboxItemInput } from '../../InboxItem/InboxItem.tsx';

interface searchDialogsProps {
  parties: PartyFieldsFragment[];
  searchValue?: string;
  status?: DialogStatus;
}
interface UseSearchDialogsOutput {
  isLoading: boolean;
  isSuccess: boolean;
  searchResults: InboxItemInput[];
  isFetching: boolean;
}

export const useSearchDialogs = ({ parties, searchValue }: searchDialogsProps): UseSearchDialogsOutput => {
  const { organizations } = useOrganizations();
  const partyURIs = parties.map((party) => party.party);
  const debouncedSearchString = useDebounce(searchValue, 300)[0];
  const enabled = !!debouncedSearchString && debouncedSearchString.length > 2 && parties.length > 0;
  const { data, isSuccess, isLoading, isFetching } = useQuery<GetAllDialogsForPartiesQuery>({
    queryKey: [QUERY_KEYS.SEARCH_DIALOGS, partyURIs, debouncedSearchString],
    queryFn: () => searchDialogs(partyURIs, debouncedSearchString),
    staleTime: 1000 * 60 * 10,
    enabled,
  });
  const [searchResults, setSearchResults] = useState([] as InboxItemInput[]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    setSearchResults(enabled ? mapDialogDtoToInboxItem(data?.searchDialogs?.items ?? [], parties, organizations) : []);
  }, [setSearchResults, data?.searchDialogs?.items, enabled, parties, organizations]);

  return {
    isLoading,
    isSuccess,
    searchResults,
    isFetching,
  };
};
