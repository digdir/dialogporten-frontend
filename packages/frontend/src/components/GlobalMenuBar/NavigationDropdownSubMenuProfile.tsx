import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { useParties } from '../../api/useParties.ts';
import { HorizontalLine } from '../HorizontalLine';
import { MenuItem } from '../MenuBar';
import { PartyListContainer } from '../PartyDropdown/PartyListContainer.tsx';
import { MenuLogoutButton } from './MenuLogoutButton.tsx';
import type { DropdownSubMenuProps } from './NavigationDropdownSubMenu.tsx';
import styles from './navigationDropdownMenu.module.css';

export const NavigationDropdownSubMenuProfile: React.FC<DropdownSubMenuProps> = ({ onClose, onBack }) => {
  const { t } = useTranslation();
  const { parties } = useParties();
  if (!parties.length) {
    return null;
  }

  return (
    <div className={styles.menuItems}>
      <ul className={styles.menuList}>
        <MenuItem
          leftContent={
            <div
              role="button"
              tabIndex={0}
              className={styles.linkContent}
              onClick={onBack}
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onBack();
              }}
            >
              <ArrowLeftIcon className={styles.backButtonIcon} />
              <span className={styles.subMenuTitle}>{t('word.main_menu')}</span>
            </div>
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
