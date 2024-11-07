import type { AvatarType } from '@altinn/altinn-components';
import type React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWindowSize } from '../../../utils/useWindowSize.tsx';
import { getSearchStringFromQueryParams } from '../../pages/Inbox/queryParams';
import { GlobalMenuBar } from '../GlobalMenuBar/GlobalMenuBar.tsx';
import { AltinnLogo } from './AltinnLogo';
import { SearchBar } from './SearchBar';
import styles from './header.module.css';

type HeaderProps = {
  name: string;
  profile: AvatarType;
  notificationCount?: number;
};

export const useSearchString = () => {
  const [searchParams, updateSearchParams] = useSearchParams();
  const searchFromQueryParam = getSearchStringFromQueryParams(searchParams);
  const [searchString, setSearchString] = useState<string>(searchFromQueryParam);
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
    if (searchFromQueryParam !== searchString) {
      setSearchString(searchFromQueryParam || '');
    }
  }, [searchString, searchFromQueryParam]);

  return { searchString, setSearchString: handleSearchString };
};

/**
 * Renders a header with Altinn logo, search bar, and a menu bar. The menu includes user details,
 * company association, and an optional notification count. The search bar is hidden on mobile.
 *
 * @component
 * @param {string} props.name - Name of selected party.
 * @param {AvatarProfile} [props.profile] - Profile.
 * @param {number} [props.notificationCount] - Optional count of notifications to display.
 * @returns {JSX.Element} The Header component.
 *
 * @example
 * <Header
 *  name="Ola Nordmann"
 *  profile="person"
 *  notificationCount={3}
 * />
 */

export const Header: React.FC<HeaderProps> = ({ name, profile, notificationCount }) => {
  const { isTabletOrSmaller } = useWindowSize();
  return (
    <header data-testid="main-header">
      <nav className={styles.navigation} aria-label="Navigasjon">
        <AltinnLogo className={styles.logo} />
        {!isTabletOrSmaller && <SearchBar />}
        <GlobalMenuBar notificationCount={notificationCount} name={name} profile={profile} />
      </nav>
      {isTabletOrSmaller && <SearchBar />}
    </header>
  );
};
