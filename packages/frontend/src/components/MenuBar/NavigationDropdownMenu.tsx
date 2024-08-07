import { Button } from '@digdir/designsystemet-react';
import { InboxFillIcon, MenuGridIcon, PersonChatIcon } from '@navikt/aksel-icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HorizontalLine } from '..';
import { MenuItem } from './MenuItem';
import { NavigationDropdownSubMenu, type SubMenuSelection } from './NavigationDropdownSubMenu';
import { UserInfo } from './UserInfo';
import styles from './navigationDropdownMenu.module.css';

interface NavigationDropdownMenuProps {
  showDropdownMenu: boolean;
  name: string;
  companyName?: string;
  onClose: () => void;
  showSubMenu: SubMenuSelection;
  setShowSubMenu: (showSubMenu: SubMenuSelection) => void;
}

export const NavigationDropdownMenu: React.FC<NavigationDropdownMenuProps> = ({
  showDropdownMenu,
  name,
  companyName,
  onClose,
  showSubMenu,
  setShowSubMenu,
}) => {
  const { t } = useTranslation();

  const handleClose = () => {
    onClose?.();
    setShowSubMenu('none');
  };

  useEscapeKey(handleClose);

  if (showSubMenu !== 'none')
    return (
      <NavigationDropdownSubMenu
        showDropdownSubMenu={showSubMenu}
        onClose={handleClose}
        onBack={() => setShowSubMenu('none')}
      />
    );

  if (!showDropdownMenu) return null;

  return (
    <div className={styles.menuItems}>
      <ul className={styles.menuList}>
        <UserInfo name={name} companyName={companyName} onClick={() => setShowSubMenu('profile')} />
        <HorizontalLine />
        <MenuItem
          displayText={t('sidebar.inbox')}
          label={t('sidebar.inbox.label')}
          icon={<InboxFillIcon />}
          onClose={handleClose}
          onClick={() => setShowSubMenu('inbox')}
          isActive={true}
          isWhiteBackground
        />
        <MenuItem
          displayText={t('menuBar.all_services')}
          label={t('link.goToAllServices')}
          icon={<MenuGridIcon />}
          onClose={handleClose}
          path="https://info.altinn.no/skjemaoversikt/"
          isExternalLink
          isWhiteBackground
        />
        <MenuItem
          displayText={t('menuBar.chat')}
          label={t('menuBar.chat.label')}
          icon={<PersonChatIcon />}
          onClose={handleClose}
          path="https://info.altinn.no/hjelp/"
          isExternalLink
          isWhiteBackground
        />
        <HorizontalLine />
        <MenuLogoutButton />
      </ul>
    </div>
  );
};

export const toTitleCase = (str: string | undefined) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => (word !== 'as' ? word.charAt(0).toUpperCase() + word.slice(1) : word.toUpperCase()))
    .join(' ');
};

export const MenuLogoutButton = () => {
  const { t } = useTranslation();
  const logOut = () => {
    (window as Window).location = `/api/logout`;
  };

  return (
    <MenuItem
      leftContent={
        <Button variant="secondary" className={styles.logoutButton} onClick={logOut}>
          {t('word.log_out')}
        </Button>
      }
      fullWidth
    />
  );
};

const useEscapeKey = (onEscape: () => void): void => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape();
      }
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onEscape]);
};
