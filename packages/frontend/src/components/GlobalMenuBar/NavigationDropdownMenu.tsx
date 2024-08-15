import { InboxFillIcon, MenuGridIcon, PersonChatIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '../MenuBar';
import { HorizontalLine } from '../index.ts';
import { MenuLogoutButton } from './MenuLogoutButton.tsx';
import { NavigationDropdownSubMenu, type SubMenuSelection } from './NavigationDropdownSubMenu.tsx';
import { UserInfo } from './UserInfo.tsx';
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
          toolTipText={t('sidebar.inbox.label')}
          leftIcon={<InboxFillIcon />}
          onClick={() => setShowSubMenu('inbox')}
          isActive
          isWhiteBackground={false}
        />
        <MenuItem
          displayText={t('menuBar.all_services')}
          toolTipText={t('link.goToAllServices')}
          leftIcon={<MenuGridIcon />}
          path="https://info.altinn.no/skjemaoversikt/"
          isExternalLink
          isWhiteBackground
        />
        <MenuItem
          displayText={t('menuBar.chat')}
          toolTipText={t('menuBar.chat.label')}
          leftIcon={<PersonChatIcon />}
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
