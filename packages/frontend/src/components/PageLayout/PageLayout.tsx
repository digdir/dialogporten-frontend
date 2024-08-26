import cx from 'classnames';
import type React from 'react';
import { memo, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { Footer, Header, type ItemPerViewCount, Sidebar } from '..';
import { useWindowSize } from '../../../utils/useWindowSize.tsx';
import { useDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { useAuthenticated } from '../../auth';
import { getSearchStringFromQueryParams } from '../../pages/Inbox/queryParams.ts';
import { useSavedSearches } from '../../pages/SavedSearches/useSavedSearches.ts';
import { useProfile } from '../../profile';
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
    const { isTabletOrSmaller } = useWindowSize();
    const showSidebar = !isTabletOrSmaller && !inSelectionMode;
    const { selectedParties } = useParties();
    const { currentPartySavedSearches } = useSavedSearches(selectedParties);
    const { dialogsByView } = useDialogs(selectedParties);
    const itemsPerViewCount = {
      inbox: dialogsByView.inbox.length,
      drafts: dialogsByView.drafts.length,
      sent: dialogsByView.sent.length,
      'saved-searches': currentPartySavedSearches?.length ?? 0,
      archive: 0,
      deleted: 0,
    } as ItemPerViewCount;

    return (
      <>
        <Header name={name} companyName={companyName} notificationCount={notificationCount} />
        <div className={styles.pageLayout}>
          {showSidebar && <Sidebar itemsPerViewCount={itemsPerViewCount} isCompany={isCompany} />}
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
  const { selectedParties } = useParties();
  const { dialogsByView } = useDialogs(selectedParties);
  const { inbox: dialogs } = dialogsByView;
  const notificationCount = dialogs.length;
  useProfile();

  const name = selectedParties.find((party) => party.partyType === 'Person')?.name || '';
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
