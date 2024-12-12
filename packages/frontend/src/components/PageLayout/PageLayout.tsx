import {
  type FooterProps,
  type HeaderProps,
  Layout,
  type LayoutProps,
  type MenuItemProps,
  RootProvider,
} from '@altinn/altinn-components';
import { useQueryClient } from '@tanstack/react-query';
import { type ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useSearchParams } from 'react-router-dom';
import { useDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { getSearchStringFromQueryParams } from '../../pages/Inbox/queryParams.ts';
import { useSavedSearches } from '../../pages/SavedSearches/useSavedSearches.ts';
import { useProfile } from '../../profile';
import { BetaBanner } from '../BetaBanner/BetaBanner';
import { useAuth } from '../Login/AuthContext.tsx';
import { useAccounts } from './Accounts/useAccounts.tsx';
import { Background } from './Background';
import { useFooter } from './Footer';
import { useGlobalMenu } from './GlobalMenu';
import { useSearchAutocompleteDialogs, useSearchString } from './Search';

export const ProtectedPageLayout = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return null;
  }
  return <PageLayout />;
};

export const PageLayout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { searchValue, setSearchValue, onClear } = useSearchString();
  const { selectedProfile, selectedParties, parties, selectedPartyIds, setSelectedPartyIds } = useParties();
  const { dialogs } = useDialogs(parties);
  const { autocomplete } = useSearchAutocompleteDialogs({ parties: selectedParties, searchValue });
  const { accounts, selectedAccount, accountSearch, accountGroups } = useAccounts({
    parties,
    selectedParties,
    dialogs,
  });
  const { currentPartySavedSearches } = useSavedSearches(selectedPartyIds);
  const { dialogsByView } = useDialogs(selectedParties);
  const itemsPerViewCount = {
    inbox: dialogsByView.inbox.filter((item) => !item.isSeenByEndUser).length,
    drafts: dialogsByView.drafts.length,
    sent: dialogsByView.sent.length,
    'saved-searches': currentPartySavedSearches?.length ?? 0,
    archive: dialogsByView.archive.length,
    bin: dialogsByView.bin.length,
  };

  const footer: FooterProps = useFooter();
  const { global, sidebar } = useGlobalMenu({ itemsPerViewCount });

  useProfile();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    const searchString = getSearchStringFromQueryParams(searchParams);
    queryClient.setQueryData(['search'], () => searchString || '');
  }, [searchParams]);

  const headerProps: HeaderProps = {
    currentAccount: selectedAccount,
    logo: {
      as: (props: MenuItemProps) => <Link to="/" {...props} />,
    },
    badge:
      itemsPerViewCount.inbox > 0
        ? {
            label: itemsPerViewCount.inbox.toString(),
            color: 'alert',
            size: 'sm',
          }
        : undefined,
    search: {
      expanded: false,
      name: t('word.search'),
      placeholder: t('word.search'),
      value: searchValue,
      onClear: () => onClear(),
      onChange: (event: ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value),
      autocomplete: {
        ...autocomplete,
        items: autocomplete.items.map((item) => ({
          ...item,
          onClick: () => onClear(),
        })),
      },
    },
    menu: {
      menuLabel: t('word.menu'),
      items: global,
      accountGroups,
      accounts,
      onSelectAccount: (account: string) => {
        if (account === 'ALL') {
          setSelectedPartyIds([], true);
        } else {
          setSelectedPartyIds([account], false);
        }
      },
      changeLabel: t('layout.menu.change_account'),
      backLabel: t('word.back'),
      ...(accountSearch && {
        accountSearch,
      }),
      logoutButton: {
        label: t('word.log_out'),
        onClick: () => {
          (window as Window).location = `/api/logout`;
        },
      },
    },
  };

  const layoutProps: LayoutProps = {
    theme: selectedProfile,
    header: headerProps,
    footer,
    sidebar: {
      theme: selectedProfile,
      menu: {
        items: sidebar,
      },
    },
    children: undefined,
  };

  return (
    <Background isCompany={selectedProfile === 'company'}>
      <BetaBanner />
      <RootProvider>
        <Layout theme={selectedProfile} {...layoutProps}>
          <Outlet />
        </Layout>
      </RootProvider>
    </Background>
  );
};
