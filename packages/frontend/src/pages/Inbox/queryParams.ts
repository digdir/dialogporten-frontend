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

/* except current location.search and returns location.search only with GlobalQueryParams if provided in location.search  */
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
