import { useTranslation } from "react-i18next";
import styles from './menubar.module.css';
import { ArrowLeftIcon, MenuGridIcon } from '@navikt/aksel-icons';
import { Hr } from ".";
import { useParties } from "../../api/useParties";
import { MenuLogoutButton } from "./DropDownMenu";
import { DropdownSubMenuProps } from "./DropDownSubMenu";
import { DropDownMenuItem } from "./DropDownMenuItem";


export const DropdownSubMenuProfile: React.FC<DropdownSubMenuProps> = ({ onClose, onBack }) => {
  const { t } = useTranslation();
  const { parties } = useParties()

  return (
    <div className={styles.menuItems}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <div role="button" tabIndex={0} className={styles.menuColumn} onClick={onBack} >
            <ArrowLeftIcon className={styles.backButtonIcon} /><span className={styles.subMenuTitle}>{t('word.main_menu')}</span>
          </div>
        </li>
        <Hr />
        {parties.map((party, i) =>
          <DropDownMenuItem key={party.party} displayText={party.name} label={party.name} icon={<MenuGridIcon />} onClick={onClose} count={i + 1} />
        )}
        <Hr />
        <MenuLogoutButton />
      </ul>
    </div>
  )
}
