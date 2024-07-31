import cx from 'classnames';
import type React from 'react';
import { memo, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { Footer, Header, Sidebar } from '..';
import { useDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { useAuthenticated } from '../../auth';
import { getSearchStringFromQueryParams } from '../../pages/Inbox/queryParams.ts';
import { useProfile } from '../../profile/useProfile';
import { BottomDrawerContainer } from '../BottomDrawer';
import { Snackbar } from '../Snackbar';
import { SelectedDialogsContainer, useSelectedDialogs } from './SelectedDialogs.tsx';
import styles from './pageLayout.module.css';

export const useUpdateOnLocationChange = (fn: () => void) => {
  const location = useLocation();
  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    fn();
  }, [location, fn]);
};

interface PageLayoutContentProps {
  name: string;
  isCompany: boolean;
  companyName?: string;
  notificationCount?: number;
}

const PageLayoutContent: React.FC<PageLayoutContentProps> = memo(
  ({ name, companyName, isCompany, notificationCount }) => {
    const { inSelectionMode } = useSelectedDialogs();

    return (
      <>
        <Header name={name} companyName={companyName} notificationCount={notificationCount} />
        <div className={styles.pageLayout}>
          {!inSelectionMode && <Sidebar isCompany={isCompany} />}
          <Outlet />
        </div>
        <Footer />
      </>
    );
  },
);

const Background: React.FC<{ children: React.ReactNode; isCompany: boolean }> = ({ children, isCompany }) => {
  const { inSelectionMode } = useSelectedDialogs();

  return (
    <div
      className={cx(styles.background, {
        isCompany: isCompany,
        [styles.inSelectionMode]: inSelectionMode,
      })}
    >
      {children}
    </div>
  );
};

export const PageLayout: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { parties, selectedParties } = useParties();
  const name = parties.find((party) => party.partyType === 'Person')?.name || '';
  const { dialogsByView } = useDialogs(parties);
  const { inbox: dialogs } = dialogsByView;
  const notificationCount = dialogs.length;
  useProfile();

  const isCompany = selectedParties?.some((party) => party.partyType === 'Organization');
  const companyName = selectedParties?.some((party) => party.partyType === 'Organization')
    ? selectedParties?.find((party) => party.partyType === 'Organization')?.name
    : '';

  useAuthenticated();
  useUpdateOnLocationChange(() => {
    const searchString = getSearchStringFromQueryParams(searchParams);
    queryClient.setQueryData(['search'], () => searchString || '');
  });

  return (
    <SelectedDialogsContainer>
      <Background isCompany={isCompany}>
        <BottomDrawerContainer>
          <PageLayoutContent
            name={name}
            companyName={companyName}
            isCompany={isCompany}
            notificationCount={notificationCount}
          />
          <Snackbar />
        </BottomDrawerContainer>
      </Background>
    </SelectedDialogsContainer>
  );
};
