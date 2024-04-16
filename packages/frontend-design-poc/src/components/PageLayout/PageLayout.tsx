import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, Header, Sidebar } from '..';
import { useAuthenticated } from '../../auth';
import { FeatureFlagKeys, useFeatureFlag } from '../../featureFlags';
import styles from './pageLayout.module.css';

export const PageLayout: React.FC = () => {
  const [companyName, setCompanyName] = React.useState<string>('Aker Solutions AS');
  const isCompany = !!companyName;
  const isTestFeatureToggleEnabled = useFeatureFlag<boolean>(FeatureFlagKeys.TestFeatureToggleEnabled);
  useAuthenticated();

  return (
    <div className={isCompany ? `isCompany` : ''}>
      <p>isTestFeatureToggleEnabled: {JSON.stringify(isTestFeatureToggleEnabled)}</p>
      <button type="button" onClick={() => setCompanyName(companyName !== '' ? '' : 'Aker Solutions AS')}>
        User/Company Switch
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
          (window as Window).location = `/api/logout`;
        }}
      >
        Logout
      </button>
      <div className={styles.pageLayout}>
        <Header name="John Doe" companyName={companyName} />
        <Sidebar isCompany={!!companyName} />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};
