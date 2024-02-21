import { Outlet } from 'react-router-dom';
import { Footer, Header, Sidebar } from '..';
import styles from './pageLayout.module.css';
import React from 'react';

export const PageLayout: React.FC = () => {
  const [companyName, setCompanyName] = React.useState<string>('Aker Solutions AS');
  return (
    <>
      <button type="button" onClick={() => setCompanyName(companyName !== '' ? '' : 'Aker Solutions AS')}>
        User/Company Switch
      </button>
      <div className={styles.pageLayout}>
        <Header name="John Doe" companyName={companyName} />
        <Sidebar isCompany={!!companyName} />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};
