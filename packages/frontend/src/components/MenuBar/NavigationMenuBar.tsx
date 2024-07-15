import { XMarkIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from '../../../utils/useWindowSize';
import { Avatar } from '../Avatar';
import { Backdrop } from '../Backdrop';
import { NavigationDropdownMenu } from './NavigationDropdownMenu';
import type { SubMenuSelection } from './NavigationDropdownSubMenu';
import styles from './navigationMenu.module.css';

const NotificationCount: React.FC<{ count: number }> = ({ count }) => {
  const { t } = useTranslation();
  if (!count) return null;
  return (
    <div className={cx(styles.counterWrapper)} aria-label={t('notifications.count', { count })}>
      <span className={styles.counter}>{count}</span>
    </div>
  );
};

export const Hr = () => <div className={styles.hr} />;

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
  const { isMobile } = useWindowSize();

  const handleToggle = () => {
    setShowDropdownMenu((prev) => !prev);
  };

  const handleClose = () => {
    setShowDropdownMenu(false);
    setShowSubMenu('none');
  };

  if (isMobile)
    return (
      <div
        className={styles.menuContainer}
        onClick={handleToggle}
        onKeyDown={(e) => e.key === 'Enter' && handleToggle()}
      >
        <p className={styles.menuText}>{t('word.menu')}</p>
        <div className={cx(styles.menuCircle, className)} aria-hidden="true">
          <Avatar name={name} companyName={companyName} type={'small'} />
        </div>
        <NotificationCount count={notificationCount} />
        <NavigationDropdownMenu
          showDropdownMenu={showDropdownMenu}
          name={name}
          companyName={companyName}
          onClose={handleClose}
          showSubMenu={showSubMenu}
          setShowSubMenu={setShowSubMenu}
        />
      </div>
    );

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
          <NotificationCount count={notificationCount} />
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
