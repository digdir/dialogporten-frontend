import type { SavedSearchData } from 'bff-types-generated';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { Filter } from '../../components';
import type { SortingOrder } from '../../components/SortOrderDropdown/SortOrderDropdown.tsx';

export const compressQueryParams = (params: SavedSearchData): string => {
  const queryParamsString = JSON.stringify(params);
  return compressToEncodedURIComponent(queryParamsString);
};

export const decompressQueryParams = (compressedString: string): SavedSearchData => {
  const decompressedString = decompressFromEncodedURIComponent(compressedString);
  if (!decompressedString) {
    throw new Error('Decompression failed');
  }
  return JSON.parse(decompressedString);
};

export const getFiltersFromQueryParams = (searchParams: URLSearchParams): Filter[] => {
  const compressedData = searchParams.get('data');
  if (compressedData) {
    try {
      const queryParams = decompressQueryParams(compressedData);
      return queryParams.filters as Filter[];
    } catch (error) {
      console.error('Failed to decompress query parameters:', error);
    }
  }
  return [] as Filter[];
};

export const getSortingOrderFromQueryParams = (searchParams: URLSearchParams): SortingOrder => {
  return searchParams.get('sortBy') as SortingOrder;
};
