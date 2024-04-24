import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getIsAuthenticated } from './api.ts';
import { getStoredURL, isRedirectURL, removeStoredURL, saveURL } from './url.ts';

export const useAuthenticated = () => {
  const { data: isAuthenticated, isSuccess: isAuthenticatedSuccess } = useQuery('isAuthenticated', getIsAuthenticated);

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
