import type { AutocompleteProps } from '@altinn/altinn-components/dist/components/Searchbar/Autocomplete';
import type { AutocompleteItemProps } from '@altinn/altinn-components/dist/components/Searchbar/AutocompleteItem';
import { useQuery } from '@tanstack/react-query';
import type { DialogStatus, GetAllDialogsForPartiesQuery, PartyFieldsFragment } from 'bff-types-generated';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { mapDialogDtoToInboxItem, searchDialogs } from '../../../api/useDialogs.tsx';
import { QUERY_KEYS } from '../../../constants/queryKeys.ts';
import type { InboxItemInput } from '../../../pages/Inbox/Inbox.tsx';
import { useOrganizations } from '../../../pages/Inbox/useOrganizations.ts';
import { useSearchString } from './useSearchString.tsx';

interface searchDialogsProps {
  parties: PartyFieldsFragment[];
  searchValue?: string;
  status?: DialogStatus;
}
interface UseSearchDialogsOutput {
  isLoading: boolean;
  isSuccess: boolean;
  searchResults: InboxItemInput[];
  autocomplete: AutocompleteProps;
  isFetching: boolean;
}

const getSkeletonItems = (size: number) => {
  return Array.from({ length: size }, (_, index) => {
    const randomTitle = Math.random()
      .toString(2)
      .substring(2, 9 + Math.floor(Math.random() * 7));
    const randomDescription = Math.random()
      .toString(2)
      .substring(2, 10 + Math.floor(Math.random() * 21));
    return {
      id: `loading-${index + 1}`,
      title: randomTitle,
      icon: 'inbox',
      description: randomDescription,
      loading: true,
      groupId: 'searching',
      disabled: false,
    };
  });
};

const createAutocomplete = (
  searchResults: InboxItemInput[],
  isLoading: boolean,
  searchValue?: string,
  onSearch?: (value: string) => void,
): AutocompleteProps => {
  const skeletonSize = 1;
  const resultsSize = 5;
  const isSearchable = (searchValue?.length ?? 0) > 2;

  const mapSearchResults = () =>
    searchResults.slice(0, resultsSize).map((item) => ({
      id: item.id,
      groupId: 'searchResults',
      as: (props: AutocompleteItemProps) => <Link to={`/inbox/${item.id}${location.search}`} {...props} />,
      title: item.title,
      description: item.summary,
      type: 'dialog',
    }));

  const getScopeItem = (label: React.ReactNode, badgeLabel?: string) => ({
    id: 'inboxScope',
    type: 'scope',
    disabled: searchResults.length === 0,
    onClick: () => onSearch?.(searchValue ?? ''),
    badge: badgeLabel ? { label: badgeLabel } : undefined,
    label: () => <span>{label}</span>,
  });

  if (isLoading) {
    return {
      items: [getScopeItem('Alt i innboks'), ...getSkeletonItems(skeletonSize)],
      groups: { searching: { title: `Søker etter «${searchValue}»...` } },
    } as AutocompleteProps;
  }

  if (!isSearchable) {
    return {
      items: [getScopeItem('Alt i innboks')],
    } as AutocompleteProps;
  }

  const searchHits = mapSearchResults();

  if (searchHits.length === 0) {
    return {
      items: [
        getScopeItem(
          <span>
            <mark>{searchValue}</mark> i innboks
          </span>,
          'Ingen treff',
        ),
      ],
      groups: { noHits: { title: 'Ingen treff' } },
    } as AutocompleteProps;
  }

  return {
    items: [
      getScopeItem(
        <span>
          <mark>{searchValue}</mark> i innboks
        </span>,
        `${searchResults.length} treff`,
      ),
      ...searchHits,
    ],
    groups: { searchResults: { title: 'Anbefalte treff' } },
  } as AutocompleteProps;
};

export const useSearchDialogs = ({ parties, searchValue }: searchDialogsProps): UseSearchDialogsOutput => {
  const { organizations } = useOrganizations();
  const { onSearch } = useSearchString();
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

  const autocomplete: AutocompleteProps = useMemo(
    () => createAutocomplete(searchResults, isLoading, searchValue, onSearch),
    [searchResults, isLoading, searchValue, onSearch],
  );

  return {
    isLoading,
    isSuccess,
    searchResults,
    autocomplete,
    isFetching,
  };
};
