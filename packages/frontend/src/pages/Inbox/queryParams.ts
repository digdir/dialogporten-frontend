import type { Filter } from '../../components';
import type { SortingOrder } from '../../components/SortOrderDropdown/SortOrderDropdown.tsx';

export const getFiltersFromQueryParams = (searchParams: URLSearchParams): Filter[] => {
  const compressedData = searchParams.get('filters');
  return compressedData ? JSON.parse(compressedData) : ([] as Filter[]);
};

export const clearFiltersInQueryParams = (): void => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete('filters');
  window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
};

export const getSortingOrderFromQueryParams = (searchParams: URLSearchParams): SortingOrder => {
  return searchParams.get('sortBy') as SortingOrder;
};

export const getSearchStringFromQueryParams = (searchParams: URLSearchParams): string => {
  return searchParams.get('search') || '';
};

export const getSelectedPartyFromQueryParams = (searchParams: URLSearchParams): string => {
  return decodeURIComponent(searchParams.get('party') || '');
};

export const getSelectedAllPartiesFromQueryParams = (searchParams: URLSearchParams): boolean => {
  return searchParams.get('allParties') === 'true';
};
