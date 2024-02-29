import { Search } from '@digdir/design-system-react';
import cx from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import { AltinnLogo } from './AltinnLogo';
import styles from './header.module.css';

type HeaderProps = {
  name: string;
  companyName?: string;
};

const getInitials = (name: string, companyName?: string) => {
  if (!companyName?.length) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  }

  return companyName[0];
};

/**
 * Simple header component with a logo, search bar, and user name with initials.
 * 
 *
 * @component
 * @param {string} props.name - The name of the user.
 * @param {string} props.companyName - The name of the company the user is associated with if any.
 * @returns {JSX.Element} The header component.
 *
 * @example
 * <Header 
 * name={'Ola Nordmann'} 
 * companyName="Aker Solutions AS" 
 * />

 */
export const Header: React.FC<HeaderProps> = ({ name, companyName }) => {
  return (
    <header>
      <nav className={styles.navigation} aria-label="Navigasjon">
        <div className={styles.logo}>
          <Link to="/" aria-label="Gå til hovedsiden">
            <AltinnLogo aria-label="Altinn logo" />
            <span className={styles.logoText}>Altinn</span>
          </Link>
        </div>
        <div className={styles.searchBar}>
          <Search size="small" aria-label="Søk" />
        </div>
        {companyName ? (
          <div className={styles.nameWithInitials}>
            <div className={styles.companyContainer}>
              <div className={styles.primaryName}>{companyName}</div>
              <div className={styles.secondaryName}>{name}</div>
            </div>
            <div className={cx(styles.initialsCircle, styles.isOrganization)} aria-hidden="true">
              {getInitials(name, companyName)}
            </div>
          </div>
        ) : (
          <div className={styles.nameWithInitials}>
            <span className={styles.primaryName}>{name}</span>
            <div className={styles.initialsCircle} aria-hidden="true">
              {getInitials(name, companyName)}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
