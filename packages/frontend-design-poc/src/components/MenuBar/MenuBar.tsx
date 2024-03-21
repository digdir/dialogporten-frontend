import cx from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from '../../../utils/useWindowSize';
import { Avatar } from '../Avatar/Avatar';
import { MenuBarDropdown, MenuBarItemProps } from './MenuBarItem';
import styles from './menubar.module.css';

interface MenuBarProps {
  name: string;
  companyName?: string;
  items: MenuBarItemProps[];
  className?: string;
  notificationCount?: number;
}

const NotificationCount: React.FC<{ count: number }> = ({ count }) => {
  const { t } = useTranslation();
  return count ? (
    <span className={cx(styles.counter)} aria-label={t('notifications.count', { count })}>
      {count}
    </span>
  ) : (
    <></>
  );
};

export const MenuBar: React.FC<MenuBarProps> = ({ name, companyName, items, notificationCount = 4, className }) => {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();

  const handleOpen = () => {
    setShowDropdownMenu((showDropdownMenu) => !showDropdownMenu);
  };

  if (isMobile)
    return (
      <div className={styles.menuContainer} onClick={handleOpen} onKeyDown={(e) => e.key === 'Enter' && handleOpen()}>
        <p className={styles.menuText}>{t('word.menu')}</p>
        <div className={cx(styles.menuCircle, className)} aria-hidden="true">
          <Avatar name={name} companyName={companyName} />
          <MenuBarDropdown show={showDropdownMenu} items={items} />
        </div>
        <NotificationCount count={notificationCount} />
      </div>
    );

  return (
    <div className={styles.menuContainer} onClick={handleOpen} onKeyDown={(e) => e.key === 'Enter' && handleOpen()}>
      <div className={cx(styles.menuCircle, className)} aria-hidden="true">
        <div className={styles.nameWithInitials}>
          <Avatar name={name} companyName={companyName} />
          <div className={styles.nameContainer}>
            {companyName ? (
              <>
                <div className={styles.primaryName}>{companyName}</div>
                <div className={styles.secondaryName}>{name}</div>
              </>
            ) : (
              <div className={styles.nameContainer}>
                <span className={styles.primaryName}>{name}</span>
              </div>
            )}
          </div>
        </div>

        <MenuBarDropdown show={showDropdownMenu} items={items} />
      </div>
      <NotificationCount count={notificationCount} />
    </div>
  );
};
