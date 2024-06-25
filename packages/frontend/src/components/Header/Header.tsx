import type React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWindowSize } from '../../../utils/useWindowSize';
import { MenuBar } from '../MenuBar';
import { AltinnLogo } from './AltinnLogo';
import { SearchBar } from './SearchBar';
import styles from './header.module.css';
import { getSearchStringFromQueryParams } from '../../pages/Inbox/queryParams';

type HeaderProps = {
  name: string;
  companyName?: string;
  notificationCount?: number;
};

export const useSearchString = () => {
  const [searchParams, updateSearchParams] = useSearchParams();
  const [searchString, setSearchString] = useState<string>('');
  const handleSearchString = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set('search', value);
    } else {
      newSearchParams.delete('search');
    }
    updateSearchParams(newSearchParams);
    setSearchString(value);
  };

  useEffect(() => {
    const search = getSearchStringFromQueryParams(searchParams);
    if (search !== searchString) {
      setSearchString(search || '');
    }
  }, [searchParams, searchString]);

  return { searchString, setSearchString: handleSearchString };
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
    <header data-testid="main-header">
      <nav className={styles.navigation} aria-label="Navigasjon">
        <AltinnLogo className={styles.logo} />
        {!isMobile && <SearchBar />}
        <MenuBar notificationCount={notificationCount} name={name} companyName={companyName} />
      </nav>
      {isMobile && <SearchBar />}
    </header>
  );
};
