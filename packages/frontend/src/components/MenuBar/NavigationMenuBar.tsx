import { XMarkIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../Avatar';
import { Backdrop } from '../Backdrop';
import { Badge } from '../Badge';
import { NavigationDropdownMenu } from './NavigationDropdownMenu';
import type { SubMenuSelection } from './NavigationDropdownSubMenu';
import styles from './navigationMenuBar.module.css';

interface MenuBarProps {
  name: string;
  companyName?: string;
  className?: string;
  notificationCount?: number;
}

export const MenuBar: React.FC<MenuBarProps> = ({ name, companyName, notificationCount = 0, className }) => {
  const [showDropdownMenu, setShowDropdownMenu] = useState<boolean>(false);
  const [showSubMenu, setShowSubMenu] = useState<SubMenuSelection>('none');

  const { t } = useTranslation();

  const handleToggle = () => {
    setShowDropdownMenu((prev) => !prev);
  };

  const handleClose = () => {
    setShowDropdownMenu(false);
    setShowSubMenu('none');
  };

  return (
    <>
      <div className={styles.menuContainer}>
        <div onClick={handleToggle} onKeyDown={(e) => e.key === 'Enter' && handleToggle()}>
          <div className={cx(styles.menuText, className)} aria-hidden="true">
            <div className={styles.nameWithInitials}>
              {t('word.menu')}
              {showDropdownMenu ? (
                <div
                  className={cx(styles.crossSquare, className, { [styles.isOrganization]: !!companyName })}
                  aria-hidden="true"
                >
                  <XMarkIcon />
                </div>
              ) : (
                <Avatar name={name} companyName={companyName} />
              )}
            </div>
          </div>
          {notificationCount > 0 && (
            <div className={styles.notificationWrapper}>
              <Badge label={notificationCount} variant="strong" />
            </div>
          )}
        </div>
        <NavigationDropdownMenu
          showDropdownMenu={showDropdownMenu}
          name={name}
          companyName={companyName}
          onClose={handleClose}
          showSubMenu={showSubMenu}
          setShowSubMenu={setShowSubMenu}
        />
      </div>
      <Backdrop show={showDropdownMenu} onClick={handleClose} />
    </>
  );
};
