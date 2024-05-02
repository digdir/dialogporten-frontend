import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer, Header, Sidebar } from '..';
import { fetchDialogByIdExample, fetchHelloWorld } from '../../api/queries.ts';
import { useAuthenticated } from '../../auth';
import { FeatureFlagKeys, useFeatureFlag } from '../../featureFlags';
import { getSearchStringFromQueryParams } from '../../pages/Inbox/Inbox';
import { Snackbar } from '../Snackbar/Snackbar.tsx';
import styles from './pageLayout.module.css';

export const useUpdateOnLocationChange = (fn: () => void) => {
  const location = useLocation();
  useEffect(() => {
    fn();
  }, [location, fn]);
};

export const PageLayout: React.FC = () => {
  const queryClient = useQueryClient();
  const [companyName, setCompanyName] = React.useState<string>('Aker Solutions AS');
  const isCompany = !!companyName;
  const isDebugHeaderScreenEnabled = useFeatureFlag<boolean>(FeatureFlagKeys.EnableDebugHeaderScreen);

  useAuthenticated();
  useUpdateOnLocationChange(() => getSearchStringFromQueryParams(queryClient));

  return (
    <div className={isCompany ? `isCompany` : ''}>
      {isDebugHeaderScreenEnabled && (
        <section>
          <button type="button" onClick={() => setCompanyName(companyName !== '' ? '' : 'Aker Solutions AS')}>
            User/Company Switch
          </button>
          <button
            type="button"
            onClick={() => {
              fetchHelloWorld().then((response) => {
                console.log(response);
              });
            }}
          >
            Hello World
          </button>
          <button
            type="button"
            onClick={() => {
              fetch('/api/user', {
                method: 'GET',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then((response) => response.json())
                .then((d) => {
                  console.log(d);
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            }}
          >
            Fetch
          </button>
          <button
            type="button"
            onClick={() => {
              fetchDialogByIdExample('14f18e01-7ed5-0272-a810-a5683df6c64d')
                .then((d) => {
                  console.log(d.dialog?.status);
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            }}
          >
            Test proxy
          </button>
          <button
            type="button"
            onClick={() => {
              (window as Window).location = `/api/logout`;
            }}
          >
            Logout
          </button>
        </section>
      )}
      <div className={styles.pageLayout}>
        <Header name="John Doe" companyName={companyName} />
        <Sidebar isCompany={!!companyName} />
        <Outlet />
        <Footer />
      </div>
      <Snackbar />
    </div>
  );
};
