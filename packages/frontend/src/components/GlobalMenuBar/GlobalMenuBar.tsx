import { XMarkIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, type AvatarProfile } from '../Avatar';
import { Backdrop } from '../Backdrop';
import { Badge } from '../Badge';
import { NavigationDropdownMenu } from './NavigationDropdownMenu.tsx';
import type { SubMenuSelection } from './NavigationDropdownSubMenu.tsx';
import styles from './globalMenuBar.module.css';

interface GlobalMenuBarProps {
  name: string;
  profile: AvatarProfile;
  className?: string;
  notificationCount?: number;
}

export const CloseMenuButton = ({ className }: { className?: string }) => {
  return (
    <div className={cx(styles.crossSquare, className)} aria-hidden="true">
      <XMarkIcon />
    </div>
  );
};

export const GlobalMenuBar: React.FC<GlobalMenuBarProps> = ({ name, profile, notificationCount = 0, className }) => {
  const [showBackDrop, setShowBackDrop] = useState<boolean>(false);
  const [showSubMenu, setShowSubMenu] = useState<SubMenuSelection>('none');

  const { t } = useTranslation();

  const toggleShowBackdrop = () => {
    setShowBackDrop((prev) => !prev);
  };

  const handleClose = () => {
    setShowBackDrop(false);
    setShowSubMenu('none');
  };

  const showNotificationsBadge = notificationCount > 0 && !showBackDrop;
  return (
    <>
      <div className={styles.globalMenuBar}>
        <div onClick={toggleShowBackdrop} onKeyDown={(e) => e.key === 'Enter' && toggleShowBackdrop()}>
          <div className={cx(styles.menuText, className)} aria-hidden="true">
            <div className={styles.nameWithInitials}>
              {t('word.menu')}
              {showBackDrop ? <CloseMenuButton className={className} /> : <Avatar name={name} profile={profile} />}
            </div>
          </div>
          {showNotificationsBadge && (
            <div className={styles.notificationWrapper}>
              <Badge label={notificationCount} variant="strong" />
            </div>
          )}
        </div>
        <NavigationDropdownMenu
          showDropdownMenu={showBackDrop}
          name={name}
          profile={profile}
          onClose={handleClose}
          showSubMenu={showSubMenu}
          setShowSubMenu={setShowSubMenu}
        />
      </div>
      <Backdrop show={showBackDrop} onClick={handleClose} />
    </>
  );
};
