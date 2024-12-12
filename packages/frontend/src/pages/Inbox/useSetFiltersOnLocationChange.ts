import { type Dispatch, type SetStateAction, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import type { Filter } from '../../components/FilterBar/FilterBar';
import { getFiltersFromQueryParams } from './queryParams';

interface UseSetFiltersOnLocationChangeProps {
  setInitialFilters: Dispatch<SetStateAction<Filter[]>>;
}

export const useSetFiltersOnLocationChange = ({ setInitialFilters }: UseSetFiltersOnLocationChangeProps) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    setInitialFilters(getFiltersFromQueryParams(searchParams));
  }, [location.pathname]);
};
