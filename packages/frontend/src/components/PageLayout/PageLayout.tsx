import { Leva, button, useControls } from 'leva';
import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer, Header, Sidebar } from '..';
import { fetchHelloWorld, fetchProfile } from '../../api/queries.ts';
import { useAuthenticated } from '../../auth';
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
	const urlParams = new URLSearchParams(window.location.search);
	const debug = urlParams.get('debug') === "true";

  const { isCompany } = useControls({
    isCompany: false,
    helloWorld: button(async () => {
      const response = await fetchHelloWorld();
      console.log(response);
    }),
    fetchBtn: button(async () => {
      const profile = await fetchProfile();
      console.log(profile);
    })
  });

  useAuthenticated();
  useUpdateOnLocationChange(() => {
    const searchString = getSearchStringFromQueryParams();
    queryClient.setQueryData(['search'], () => searchString || '');
  });

  return (
    <div className={isCompany ? `isCompany` : ''}>
      <div className={styles.pageLayout}>
        <Header name="John Doe" companyName={isCompany ? 'ACME Corp' : ''} />
        <Sidebar isCompany={isCompany} />
        <Outlet />
        <Footer />
      </div>
      <Snackbar />
      <Leva hidden={!debug} />
    </div>
  );
};
