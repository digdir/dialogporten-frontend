import { Leva, button, useControls } from 'leva';
import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer, Header, Sidebar } from '..';
import { fetchHelloWorld, fetchProfile } from '../../api/queries.ts';
import { useAuthenticated } from '../../auth';
import { getSearchStringFromQueryParams } from '../../pages/Inbox/Inbox';
import { BottomDrawerContainer } from '../BottomDrawer';
import { Snackbar } from '../Snackbar/Snackbar.tsx';
import styles from './pageLayout.module.css';
import { useParties } from '../../api/useParties.ts';
import { useDialogs } from '../../api/useDialogs.tsx';

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
  const { parties, selectedParties } = useParties()
  const name = parties.find(party => party.partyType === 'Person')?.name || '';
  const { dialogsByView } = useDialogs(parties);
  const dialogs = dialogsByView['inbox'];
  const notificationCount = dialogs.length;

  const { isCompany: isCompanyControl } = useControls({
    isCompany: false,
    helloWorld: button(async () => {
      const response = await fetchHelloWorld();
      console.log(response);
    }),
    fetchBtn: button(async () => {
      const profile = await fetchProfile();
      console.log(profile);
    }),
  });

  const isCompany = isCompanyControl || selectedParties?.some((party) => party.partyType === 'Organization');
  const companyName = selectedParties?.some((party) => party.partyType === 'Organization') ? selectedParties?.find((party) => party.partyType === 'Organization')?.name : '';

  useAuthenticated();
  useUpdateOnLocationChange(() => {
    const searchString = getSearchStringFromQueryParams();
    queryClient.setQueryData(['search'], () => searchString || '');
  });

  return (
    <div className={isCompany ? `isCompany` : ''}>
      <BottomDrawerContainer>
        <div className={styles.pageLayout}>
          <Header name={name} companyName={companyName} notificationCount={notificationCount} />
          <Sidebar isCompany={isCompany} />
          <Outlet />
          <Footer />
        </div>
      </BottomDrawerContainer>
      <Snackbar />
      <Leva hidden={!debug} />
    </div>
  );
};
