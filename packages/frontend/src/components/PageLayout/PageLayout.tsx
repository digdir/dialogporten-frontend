import cx from 'classnames';
import type React from 'react';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { type AvatarProfile, Footer, Header, type ItemPerViewCount, Sidebar } from '..';
import { useWindowSize } from '../../../utils/useWindowSize.tsx';
import { useDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { getSearchStringFromQueryParams } from '../../pages/Inbox/queryParams.ts';
import { useSavedSearches } from '../../pages/SavedSearches/useSavedSearches.ts';
import { useProfile } from '../../profile';
import { BottomDrawerContainer } from '../BottomDrawer';
import { useAuth } from '../Login/AuthContext.tsx';
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
  profile: AvatarProfile;
  notificationCount?: number;
}

const PageLayoutContent: React.FC<PageLayoutContentProps> = memo(({ name, profile, notificationCount }) => {
  const { inSelectionMode } = useSelectedDialogs();
  const { isTabletOrSmaller } = useWindowSize();
  const showSidebar = !isTabletOrSmaller && !inSelectionMode;
  const { selectedPartyIds, selectedParties } = useParties();
  const { currentPartySavedSearches } = useSavedSearches(selectedPartyIds);
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
      <Header name={name} profile={profile} notificationCount={notificationCount} />
      <div className={styles.pageLayout}>
        {showSidebar && <Sidebar itemsPerViewCount={itemsPerViewCount} />}
        <Outlet />
      </div>
      <Footer />
    </>
  );
});

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

export const ProtectedPageLayout = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return null;
  }
  return <PageLayout />;
};

export const PageLayout: React.FC = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { selectedParties, allOrganizationsSelected } = useParties();
  const { dialogsByView } = useDialogs(selectedParties);
  const { inbox: dialogs } = dialogsByView;
  const notificationCount = dialogs.length;
  useProfile();

  const name = allOrganizationsSelected ? t('parties.labels.all_organizations') : selectedParties?.[0]?.name || '';
  const isCompany = allOrganizationsSelected || selectedParties?.[0]?.partyType === 'Organization';
  const profile = isCompany ? 'organization' : 'person';

  useUpdateOnLocationChange(() => {
    const searchString = getSearchStringFromQueryParams(searchParams);
    queryClient.setQueryData(['search'], () => searchString || '');
  });

  return (
    <SelectedDialogsContainer>
      <Background isCompany={isCompany}>
        <BottomDrawerContainer>
          <PageLayoutContent name={name} profile={profile} notificationCount={notificationCount} />
          <Snackbar />
        </BottomDrawerContainer>
      </Background>
    </SelectedDialogsContainer>
  );
};
