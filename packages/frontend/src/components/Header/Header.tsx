import { Search } from '@digdir/designsystemet-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from '../../../utils/useWindowSize';
import { MenuBar } from '../MenuBar';
import { AltinnLogo } from './AltinnLogo';
import styles from './header.module.css';
import { useQuery, useQueryClient } from 'react-query';

type HeaderProps = {
  name: string;
  companyName?: string;
  notificationCount?: number;
};

export const useSearchString = () => {
  const queryClient = useQueryClient();
  const { data: searchString } = useQuery<string>(['search'], () => '', {
    enabled: false,
    staleTime: Infinity,
  });
  return { searchString, queryClient };
};

export const HeaderSearchBar = () => {
  const { t } = useTranslation();
  const { queryClient, searchString } = useSearchString();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    queryClient.setQueryData(['search'], () => e.target.value || '');
  };
  return (
    <div className={styles.searchBar}>
      <Search
        size="small"
        aria-label={t('header.searchPlaceholder')}
        placeholder={t('header.searchPlaceholder')}
        onChange={handleSearch}
        value={searchString}
        onClear={() => {
          queryClient.setQueryData(['search'], () => '');
        }}
      />
    </div>
  );
};

/**
 * Renders a header with Altinn logo, search bar, and a menu bar. The menu includes user details,
 * company association, and an optional notification count. The search bar is hidden on mobile.
 *
 * @component
 * @param {string} props.name - User's name.
 * @param {string} [props.companyName] - Associated company name, if applicable.
 * @param {number} [props.notificationCount] - Optional count of notifications to display.
 * @returns {JSX.Element} The Header component.
 *
 * @example
 * <Header
 *  name="Ola Nordmann"
 *  companyName="Aker Solutions AS"
 *  notificationCount={3}
 * />
 */

export const Header: React.FC<HeaderProps> = ({ name, companyName, notificationCount }) => {
  const { isMobile } = useWindowSize();
  return (
    <header>
      <nav className={styles.navigation} aria-label="Navigasjon">
        <AltinnLogo className={styles.logo} />
        {!isMobile && <HeaderSearchBar />}
        <MenuBar notificationCount={notificationCount} name={name} companyName={companyName} />
      </nav>
      {isMobile && <HeaderSearchBar />}
    </header>
  );
};
