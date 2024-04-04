import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, Header, Sidebar } from '..';
import styles from './pageLayout.module.css';

export const PageLayout: React.FC = () => {
  const [companyName, setCompanyName] = React.useState<string>('Aker Solutions AS');
  const isCompany = !!companyName;

  const appStyle: React.CSSProperties & { [key: string]: string } = {
    '--background-color': isCompany ? '#E9F5FF' : '#EAF7EF',
    '--button-color': isCompany ? '#111D46' : '#084826',
    '--avatar-color': '#111D46',
    '--Action-Important': '#E02E49',
  };

  return (
    <div style={appStyle} className="app">
      <button type="button" onClick={() => setCompanyName(companyName !== '' ? '' : 'Aker Solutions AS')}>
        User/Company Switch
      </button>
      <button
        type="button"
        onClick={() => {
          (window as any).location = `/api/login?postLoginRedirectUrl=${location.href}`;
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
          (window as any).location = `/api/logout`;
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
