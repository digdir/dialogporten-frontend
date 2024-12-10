import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { QUERY_KEYS } from '../../../constants/queryKeys.ts';
import { Routes } from '../../../pages/Inbox/Inbox.tsx';
import { getSearchStringFromQueryParams } from '../../../pages/Inbox/queryParams.ts';

export const useSearchString = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchQueryParams = getSearchStringFromQueryParams(searchParams);
  const queryClient = useQueryClient();
  const { data: searchValue } = useQuery<string>({
    queryKey: [QUERY_KEYS.SEARCH_VALUE],
    enabled: false,
    staleTime: Number.POSITIVE_INFINITY,
    initialData: searchQueryParams,
  });
  const { data: enteredSearchValue } = useQuery<string>({
    queryKey: [QUERY_KEYS.ENTERED_SEARCH_VALUE],
    enabled: false,
    staleTime: Number.POSITIVE_INFINITY,
    initialData: '',
  });

  useEffect(() => {
    const searchBarParam = new URLSearchParams(searchParams);
    if (searchBarParam.get('search')) {
      return;
    }
    setSearchValue('');
    searchBarParam.delete('search');
  }, [searchParams]);

  const setSearchValue = (value: string) => {
    queryClient.setQueryData([QUERY_KEYS.SEARCH_VALUE], value);
  };

  const setEnteredSearchValue = (value: string) => {
    queryClient.setQueryData([QUERY_KEYS.ENTERED_SEARCH_VALUE], value);
  };

  const onSearch = (value: string) => {
    if (!value) {
      onClear();
    } else {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('search', value);
      if (location.pathname !== Routes.inbox) {
        navigate(Routes.inbox + `?${newSearchParams.toString()}`);
      } else {
        setSearchParams(newSearchParams, { replace: true });
      }
      setEnteredSearchValue(value);
    }
  };

  const onClear = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newSearchParams.has('search')) {
      newSearchParams.delete('search');
      setSearchParams(newSearchParams, { replace: true });
    }
    setSearchValue('');
    setEnteredSearchValue('');
  };

  return { searchValue, enteredSearchValue, setSearchValue, onSearch, onClear };
};
