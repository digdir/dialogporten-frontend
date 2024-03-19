import { Search } from '@digdir/designsystemet-react';
import cx from 'classnames';
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
 * `Header` component displaying navigation, logo, search bar, and user/company information.
 *
 * It includes a logo linking to the home page, a search bar, and displays user or company name.
 * If a company name is provided, both the company and the user's name are displayed, along with
 * initials. The component is designed with accessibility in mind, using appropriate ARIA labels.
 *
 * @param props The props of the component.
 * @param props.name The name of the user.
 * @param props.companyName The name of the company. Optional.
 * @returns The `Header` component.
 */

export const Header = ({ name, companyName }: HeaderProps): JSX.Element => {
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
