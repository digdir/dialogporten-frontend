const GlobalQueryParams = {
  search: 'search',
  party: 'party',
  allParties: 'allParties',
  mock: 'mock',
};

export const getSearchStringFromQueryParams = (searchParams: URLSearchParams): string => {
  return searchParams.get(GlobalQueryParams.search) || '';
};

export const getSelectedPartyFromQueryParams = (searchParams: URLSearchParams): string => {
  return decodeURIComponent(searchParams.get(GlobalQueryParams.party) || '');
};

export const getSelectedAllPartiesFromQueryParams = (searchParams: URLSearchParams): boolean => {
  return searchParams.get(GlobalQueryParams.allParties) === 'true';
};

/**
 * Extracts the global search query parameters from the given search string.
 *
 * This function takes the current location.search string and returns a new search string
 * containing only the global query parameters defined in GlobalQueryParams, if they are present
 * in the original location.search string.
 *
 * @param {string} search - The current location.search string.
 * @returns {string} - A new search string containing only the global query parameters, or an empty string if none are present.
 */
export const getGlobalSearchQueryParams = (search: string): string => {
  const searchParams = new URLSearchParams(search);
  const globalQueryParams = new URLSearchParams();

  for (const key of Object.values(GlobalQueryParams)) {
    if (searchParams.has(key)) {
      globalQueryParams.set(key, searchParams.get(key)!);
    }
  }

  return globalQueryParams.toString() === '' ? '' : `?${globalQueryParams.toString()}`;
};
