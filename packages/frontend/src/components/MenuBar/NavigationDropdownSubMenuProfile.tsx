import { useTranslation } from "react-i18next";
import styles from './navigationMenu.module.css';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Hr } from ".";
import { useParties } from "../../api/useParties";
import { MenuLogoutButton, toTitleCase } from "./NavigationDropdownMenu";
import { DropdownSubMenuProps } from "./NavigationDropdownSubMenu";
import { Avatar } from "../Avatar";
import { useQueryClient } from "react-query";
import { useDialogs } from "../../api/useDialogs";
import { PartyFieldsFragment } from "bff-types-generated";


export const NavigationDropdownSubMenuProfile: React.FC<DropdownSubMenuProps> = ({ onClose, onBack }) => {
  const { t } = useTranslation();
  const { parties, setSelectedParties } = useParties()
  const queryClient = useQueryClient()
  const { dialogsByView } = useDialogs(parties);
  if (!parties.length) {
    return null;
  }
  const inboxItems = dialogsByView['inbox']

  const loggedInPersonName = toTitleCase(parties.find(party => party.partyType === 'Person')?.name || '' || "");

  const handleSelectParty = (parties: PartyFieldsFragment[]) => {
    setSelectedParties(parties)
    queryClient.invalidateQueries({ queryKey: ['dialogs'] })
    onClose?.()
  }

  return (
    <div className={styles.menuItems}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <div role="button" tabIndex={0} className={styles.menuColumn} onClick={onBack} >
            <ArrowLeftIcon className={styles.backButtonIcon} /><span className={styles.subMenuTitle}>{t('word.main_menu')}</span>
          </div>
        </li>
        <Hr />
        {parties.map((party) => {
          const companyName = party.partyType === 'Organization' ? toTitleCase(party.name || "") : '';
          const count = inboxItems.filter(d => d.receiver.label === party.name).length
          return (
            <li key={party.party} className={styles.menuItem} onClick={() => handleSelectParty([party])} role="button" tabIndex={0}>
              <div className={styles.sidebarMenuItem} title={loggedInPersonName}>
                <div className={styles.menuColumn} >
                  <Avatar name={loggedInPersonName} companyName={companyName} darkCircle />
                  <div>
                    <div className={styles.primaryName}>{companyName || loggedInPersonName}</div>
                    <div className={styles.secondaryName}>{companyName ? loggedInPersonName : t('word.private')}</div>
                  </div>
                </div>
                <div className={styles.counterAndIcon}>
                  {!!count && <span className={styles.menuItemCounter}>{count}</span>}
                </div>
              </div>
            </li>
          )
        }
        )}
        <Hr />
        <MenuLogoutButton />
      </ul>
    </div>
  )
}
