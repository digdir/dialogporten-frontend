import { Button } from '@digdir/designsystemet-react';
import { ChevronRightIcon, InboxFillIcon, MenuGridIcon, PersonChatIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { Hr } from '.';
import { Footer } from '..';
import { useWindowSize } from '../../../utils/useWindowSize';
import { Avatar } from '../Avatar';
import { NavigationDropdownMenuItem } from './NavigationDropdownMenuItem';
import { NavigationDropdownSubMenu, type SubMenuSelection } from './NavigationDropdownSubMenu';
import styles from './navigationMenu.module.css';

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
  const { isMobile } = useWindowSize();
  const companyNameTitleCase = toTitleCase(companyName);
  const nameTitleCase = toTitleCase(name);

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
        <li className={styles.menuItem}>
          <div
            className={styles.sidebarMenuItem}
            onClick={() => setShowSubMenu('profile')}
            onKeyDown={(e) => e.key === 'Enter' && setShowSubMenu('profile')}
            role="button"
            tabIndex={0}
          >
            <div className={styles.menuColumn} title={name}>
              <Avatar name={name} companyName={companyNameTitleCase} darkCircle />
              <div>
                <div className={styles.primaryName}>{companyNameTitleCase || nameTitleCase}</div>
                <div className={styles.secondaryName}>{companyNameTitleCase ? nameTitleCase : t('word.private')}</div>
              </div>
            </div>
            <div role="button" tabIndex={0} className={styles.menuColumn} title={t('word.change')}>
              {t('word.change')}
              <ChevronRightIcon className={styles.arrowIcon} />
            </div>
          </div>
          <Hr />
        </li>
        <NavigationDropdownMenuItem
          displayText={t('sidebar.inbox')}
          label={t('sidebar.inbox.label')}
          icon={<InboxFillIcon />}
          onClose={handleClose}
          onClick={() => setShowSubMenu('inbox')}
        />
        <NavigationDropdownMenuItem
          displayText={t('menuBar.all_services')}
          label={t('link.goToAllServices')}
          icon={<MenuGridIcon />}
          onClose={handleClose}
          path="https://info.altinn.no/skjemaoversikt/"
          isExternalLink
        />
        <NavigationDropdownMenuItem
          displayText={t('menuBar.chat')}
          label={t('menuBar.chat.label')}
          icon={<PersonChatIcon />}
          onClose={handleClose}
          path="https://info.altinn.no/hjelp/"
          isExternalLink
        />
        <Hr />
        <MenuLogoutButton />
        {isMobile && <Footer />}
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
    <li className={styles.menuItem}>
      <Button variant="secondary" className={styles.logoutButton} onClick={logOut}>
        {t('word.log_out')}
      </Button>
    </li>
  );
};
