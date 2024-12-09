import type { Filter } from '../../components';

export const getFiltersFromQueryParams = (searchParams: URLSearchParams): Filter[] => {
  const compressedData = searchParams.get('filters');
  return compressedData ? JSON.parse(compressedData) : ([] as Filter[]);
};

export const getQueryParamsWithoutFilters = (): URLSearchParams => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete('filters');
  return searchParams;
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
