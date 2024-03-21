import { Search } from '@digdir/designsystemet-react';
import { DogIcon } from '@navikt/aksel-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useWindowSize } from '../../../utils/useWindowSize';
import { MenuBar } from '../MenuBar';
import { MenuBarItemProps } from '../MenuBar/MenuBarItem';
import { AltinnLogoSvg } from './AltinnLogo';
import styles from './header.module.css';

type HeaderProps = {
  name: string;
  companyName?: string;
  notificationCount?: number;
};

const AltinnLogo = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.logo}>
      <Link to="/" aria-label={t('link.goToMain')}>
        <AltinnLogoSvg aria-label="Altinn logo" />
        <span className={styles.logoText}>Altinn</span>
      </Link>
    </div>
  );
};

const HeaderSearchBar = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.searchBar}>
      <Search size="small" aria-label={t('header.searchPlaceholder')} placeholder={t('header.searchPlaceholder')} />
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

const menuItemsMock: MenuBarItemProps[] = [{ title: 'Hjem', href: '/', icon: <DogIcon /> }];

export const Header: React.FC<HeaderProps> = ({ name, companyName, notificationCount }) => {
  const { isMobile } = useWindowSize();
  return (
    <header>
      <nav className={styles.navigation} aria-label="Navigasjon">
        <AltinnLogo />
        {!isMobile && <HeaderSearchBar />}
        <MenuBar items={menuItemsMock} notificationCount={notificationCount} name={name} companyName={companyName} />
      </nav>
      {isMobile && <HeaderSearchBar />}
    </header>
  );
};
