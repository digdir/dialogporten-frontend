import type { AutocompleteProps } from '@altinn/altinn-components';
import type { AutocompleteItemProps } from '@altinn/altinn-components/dist/components/Autocomplete/AutocompleteItem';
import { useQuery } from '@tanstack/react-query';
import type { DialogStatus, GetSearchAutocompleteDialogsQuery, PartyFieldsFragment } from 'bff-types-generated';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import {
  type SearchAutocompleteDialogInput,
  mapAutocompleteDialogsDtoToInboxItem,
  searchAutocompleteDialogs,
} from '../../../api/useDialogs.tsx';
import { QUERY_KEYS } from '../../../constants/queryKeys.ts';
import { useSearchString } from './useSearchString.tsx';

interface searchDialogsProps {
  parties: PartyFieldsFragment[];
  searchValue?: string;
  status?: DialogStatus;
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
  searchResults: SearchAutocompleteDialogInput[],
  isLoading: boolean,
  searchValue?: string,
  onSearch?: (searchString: string) => void,
): AutocompleteProps => {
  const skeletonSize = 1;
  const resultsSize = 5;
  const isSearchable = (searchValue?.length ?? 0) > 2;

  const getScopeItem = (label: React.ReactNode, badgeLabel?: string) => ({
    id: 'inboxScope',
    type: 'scope',
    disabled: searchResults.length === 0,
    onClick: () => {
      onSearch?.(searchValue ?? '');
    },
    badge: badgeLabel ? { label: badgeLabel } : undefined,
    label,
  });

  const mapSearchResults = () =>
    searchResults.slice(0, resultsSize).map((item) => ({
      id: item.id,
      groupId: 'searchResults',
      as: (props: AutocompleteItemProps) => <Link to={`/inbox/${item.id}${location.search}`} {...props} />,
      title: item.title,
      description: item.summary,
      type: 'dialog',
    }));

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

interface UseAutocompleteDialogsOutput {
  isLoading: boolean;
  isSuccess: boolean;
  autocompleteResults?: SearchAutocompleteDialogInput[];
  autocomplete: AutocompleteProps;
  isFetching: boolean;
}

export const useSearchAutocompleteDialogs = ({
  parties,
  searchValue,
}: searchDialogsProps): UseAutocompleteDialogsOutput => {
  const partyURIs = parties.map((party) => party.party);
  const debouncedSearchString = useDebounce(searchValue, 300)[0];
  const { onSearch } = useSearchString();
  const enabled = !!debouncedSearchString && debouncedSearchString.length > 2 && parties.length > 0;
  const {
    data: hits,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery<GetSearchAutocompleteDialogsQuery>({
    queryKey: [QUERY_KEYS.SEARCH_AUTOCOMPLETE_DIALOGS, partyURIs, debouncedSearchString],
    queryFn: () => searchAutocompleteDialogs(partyURIs, debouncedSearchString),
    staleTime: 1000 * 60 * 10,
    enabled,
  });

  const autocomplete: AutocompleteProps = useMemo(() => {
    const results = hits?.searchDialogs?.items ?? [];
    return createAutocomplete(mapAutocompleteDialogsDtoToInboxItem(results), isLoading, searchValue, onSearch);
  }, [hits, isLoading, searchValue, onSearch]);

  return {
    isLoading,
    isSuccess,
    autocomplete,
    isFetching,
  };
};
