import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, Header, Sidebar } from '..';
import styles from './pageLayout.module.css';

export const PageLayout: React.FC = () => {
  const [companyName, setCompanyName] = React.useState<string>('Aker Solutions AS');
  const isCompany = !!companyName;

  return (
    <div className={isCompany ? `isCompany` : ''}>
      <button type="button" onClick={() => setCompanyName(companyName !== '' ? '' : 'Aker Solutions AS')}>
        User/Company Switch
      </button>
      <button
        type="button"
        onClick={() => {
          (window as Window).location = `/api/login?postLoginRedirectUrl=${location.href}`;
        }}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => {
          fetch('/api/protected', {
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
