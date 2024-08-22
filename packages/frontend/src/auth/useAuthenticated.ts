import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getIsAuthenticated } from './api.ts';
import { getStoredURL, isRedirectURL, removeStoredURL, saveURL } from './url.ts';

/* Keeps session alive as soon as it is active, e.g. active tab in browser */
export const useAuthenticated = () => {
  const { data: isAuthenticated, isSuccess: isAuthenticatedSuccess } = useQuery('isAuthenticated', getIsAuthenticated, {
    refetchInterval: 30 * 1000,
  });

  useEffect(() => {
    const currentHref = window.location.href;
    if (!isAuthenticated && isAuthenticatedSuccess) {
      // user not logged in successfully
      saveURL(currentHref);
      (window as Window).location = `/api/login`;
    } else if (isAuthenticatedSuccess && isAuthenticated) {
      // already has a valid session or just logged in
      if (isRedirectURL(currentHref)) {
        const storedURL = getStoredURL();
        if (storedURL) {
          removeStoredURL();
          (window as Window).location = storedURL;
        }
      }
    }
  }, [isAuthenticated, isAuthenticatedSuccess]);

  return { isAuthenticated, isAuthenticatedSuccess };
};
