import type { Filter } from '../../components';
import type { SortingOrder } from '../../components/SortOrderDropdown/SortOrderDropdown.tsx';

export const getFiltersFromQueryParams = (searchParams: URLSearchParams): Filter[] => {
  const compressedData = searchParams.get('filters');
  return compressedData ? JSON.parse(compressedData) : ([] as Filter[]);
};

export const getSortingOrderFromQueryParams = (searchParams: URLSearchParams): SortingOrder => {
  return searchParams.get('sortBy') as SortingOrder;
};

export const getSearchStringFromQueryParams = (searchParams: URLSearchParams): string => {
  return searchParams.get('search') || '';
};

export const getSelectedPartyFromQueryParams = (searchParams: URLSearchParams): string => {
  return searchParams.get('party') || '';
};
