import cx from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from '../../../utils/useWindowSize';
import { Avatar } from '../Avatar';
import styles from './menubar.module.css';
import { XMarkIcon } from '@navikt/aksel-icons';
import { Backdrop } from './Backdrop';
import { DropdownMenu } from './DropDownMenu';

const NotificationCount: React.FC<{ count: number }> = ({ count }) => {
  const { t } = useTranslation();
  if (!count) return <></>;
  return (
    <span className={cx(styles.counter)} aria-label={t('notifications.count', { count })}>
      {count}
    </span>
  )
};

export const Hr = () => <div className={styles.hr} />

interface MenuBarProps {
  name: string;
  companyName?: string;
  className?: string;
  notificationCount?: number;
}

export const MenuBar: React.FC<MenuBarProps> = ({ name, companyName, notificationCount = 4, className }) => {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();

  const handleOpen = () => {
    setShowDropdownMenu((showDropdownMenu) => !showDropdownMenu);
  };

  if (isMobile)
    return (
      <>
        <div className={styles.menuContainer} onClick={handleOpen} onKeyDown={(e) => e.key === 'Enter' && handleOpen()}>
          <p className={styles.menuText}>{t('word.menu')}</p>
          <div className={cx(styles.menuCircle, className)} aria-hidden="true">
            <Avatar name={name} companyName={companyName} />
          </div>
          <NotificationCount count={notificationCount} />
          <DropdownMenu showDropdownMenu={showDropdownMenu} name={name} companyName={companyName} />
        </div>
      </>
    );

  return (
    <>
      <div className={styles.menuContainer} onClick={handleOpen} onKeyDown={(e) => e.key === 'Enter' && handleOpen()}>
        <div className={cx(styles.menuText, className)} aria-hidden="true">
          <div className={styles.nameWithInitials}>
            {t('word.menu')}
            {showDropdownMenu ? <div
              className={cx(styles.crossSquare, className, { [styles.isOrganization]: !!companyName })}
              aria-hidden="true"
            >
              <XMarkIcon />
            </div> : <Avatar name={name} companyName={companyName} />}
          </div>
        </div>
        <NotificationCount count={notificationCount} />
        <DropdownMenu showDropdownMenu={showDropdownMenu} name={name} companyName={companyName} />
      </div >
      <Backdrop show={showDropdownMenu} clicked={() => setShowDropdownMenu(false)} />
    </>
  );
};
