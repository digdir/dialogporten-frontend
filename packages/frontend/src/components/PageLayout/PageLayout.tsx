import { PartiesQuery } from 'bff-types-generated';
import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer, Header, Sidebar } from '..';
import { fetchDialogByIdExample, fetchHelloWorld, fetchParties, fetchProfile } from '../../api/queries.ts';
import { useAuthenticated } from '../../auth';
import { getSearchStringFromQueryParams } from '../../pages/Inbox/Inbox';
import { Snackbar } from '../Snackbar/Snackbar.tsx';
import styles from './pageLayout.module.css';
import { Leva, useControls, button } from 'leva';

export const useUpdateOnLocationChange = (fn: () => void) => {
  const location = useLocation();
  useEffect(() => {
    fn();
  }, [location, fn]);
};

export const useParties = () => useQuery<PartiesQuery>('parties', fetchParties);

export const PageLayout: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: partiesData } = useParties();
  const defaultParty = (partiesData?.parties ?? []).find((party) => party.partyType === 'Person')?.party;
  console.log('Default party uri used for fetching dialogs: ', defaultParty);

	const { isCompany } = useControls({
			isCompany: false,
			helloWorld: button(async () => {
				const response = await fetchHelloWorld();
				console.log(response);
			}),
			fetchBtn: button(async () => {
				const profile = await fetchProfile();
				console.log(profile);
			}),
			testProxyBtn: button(async () => {
				try {
					const d = await fetchDialogByIdExample('14f18e01-7ed5-0272-a810-a5683df6c64d');
					console.log(d.dialog?.status);
				} catch(error) {
					console.error('Error:', error);
				}
			}),
			logoutBtn: button(()=> {
				(window as Window).location = `/api/logout`;
			}),
	});

  useAuthenticated();
  useUpdateOnLocationChange(() => getSearchStringFromQueryParams(queryClient));

  return (
    <div className={isCompany ? `isCompany` : ''}>
      <div className={styles.pageLayout}>
        <Header name="John Doe" companyName={isCompany ? 'ACME Corp' : ''} />
        <Sidebar isCompany={isCompany} />
        <Outlet />
        <Footer />
      </div>
      <Snackbar />
			<Leva />
    </div>
  );
};
