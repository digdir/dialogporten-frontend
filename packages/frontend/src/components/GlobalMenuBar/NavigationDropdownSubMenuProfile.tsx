import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { HorizontalLine } from '../HorizontalLine';
import { MenuItem } from '../MenuBar';
import { PartyListContainer } from '../PartyDropdown/PartyListContainer.tsx';
import { MenuLogoutButton } from './MenuLogoutButton.tsx';
import type { DropdownSubMenuProps } from './NavigationDropdownSubMenu.tsx';
import styles from './navigationDropdownMenu.module.css';

export const NavigationDropdownSubMenuProfile: React.FC<DropdownSubMenuProps> = ({ onClose, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.menuItems}>
      <ul className={styles.menuList}>
        <MenuItem
          leftContent={
            <button type="button" className={styles.backButton} onClick={onBack}>
              <ArrowLeftIcon className={styles.backButtonIcon} />
              <span className={styles.subMenuTitle}>{t('word.main_menu')}</span>
            </button>
          }
          isWhiteBackground
        />
        <HorizontalLine />
        <PartyListContainer onSelect={onClose} />
        <HorizontalLine />
        <MenuLogoutButton />
      </ul>
    </div>
  );
};
