import type React from 'react';
import { createContext, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { getIsAuthenticated, getStoredURL, isRedirectURL, removeStoredURL, saveURL } from '../../auth';

interface AuthContextProps {
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: isAuthenticated, isFetchedAfterMount } = useQuery({
    queryKey: ['isAuthenticated'],
    queryFn: async () => getIsAuthenticated(),
    refetchInterval: 20 * 1000,
  });

  useEffect(() => {
    const currentHref = window.location.href;
    if (!isAuthenticated && isFetchedAfterMount) {
      if (currentHref) saveURL(currentHref);
      (window as Window).location = `/api/login`;
    } else if (isAuthenticated) {
      // already has a valid session or just logged in
      if (isRedirectURL(currentHref)) {
        const storedURL = getStoredURL();
        if (storedURL) {
          removeStoredURL();
          (window as Window).location = storedURL;
        }
      }
    }
  }, [isAuthenticated, isFetchedAfterMount]);

  return <AuthContext.Provider value={{ isAuthenticated: isAuthenticated ?? false }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    if (import.meta.env.MODE === 'test') {
      return { isAuthenticated: true };
    }
    throw new Error('useAuth can only be used within AuthProvider');
  }
  return context;
};
