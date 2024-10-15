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
  notificationCount?: number;
}

interface CloseMenuButtonProps {
  className?: string;
  onClose: () => void;
}

export const CloseMenuButton = ({ className, onClose }: CloseMenuButtonProps) => {
  return (
    <div
      className={cx(styles.crossSquare, className)}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClose();
        }
      }}
    >
      <XMarkIcon />
    </div>
  );
};

export const GlobalMenuBar: React.FC<GlobalMenuBarProps> = ({ name, profile, notificationCount = 0 }) => {
  const [showBackDrop, setShowBackDrop] = useState<boolean>(false);
  const [showSubMenu, setShowSubMenu] = useState<SubMenuSelection>('none');

  const { t } = useTranslation();

  const toggleShowBackdrop = () => {
    if (!showBackDrop) {
      setShowBackDrop((prev) => !prev);
    }
  };

  const handleClose = () => {
    setShowBackDrop(false);
    setShowSubMenu('none');
  };

  const showNotificationsBadge = notificationCount > 0 && !showBackDrop;
  return (
    <>
      <div
        className={styles.globalMenuBar}
        onClick={toggleShowBackdrop}
        onKeyDown={(e) => e.key === 'Enter' && toggleShowBackdrop()}
      >
        <section>
          <button
            type="button"
            className={styles.toggleOpenButton}
            aria-label={showBackDrop ? t('menuBar.close') : t('menuBar.open')}
            aria-expanded={showBackDrop}
            aria-controls="global-menu"
          >
            <div className={styles.menuText} aria-hidden="true">
              <div className={styles.menuButtonWrapper}>
                <div className={styles.menuButtonText}>{t('word.menu')}</div>
                {showBackDrop ? (
                  <CloseMenuButton className={styles.closeMenuButton} onClose={handleClose} />
                ) : (
                  <Avatar name={name} profile={profile} />
                )}
              </div>
            </div>
            {showNotificationsBadge && (
              <div className={styles.notificationWrapper}>
                <Badge label={notificationCount} variant="strong" />
              </div>
            )}
          </button>
        </section>
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
