import { useTranslation } from "react-i18next";
import styles from './navigationMenu.module.css';
import { ArrowLeftIcon, CogIcon, FileCheckmarkIcon, FileTextIcon, FolderMinusIcon, InboxFillIcon, MagnifyingGlassIcon, TrashIcon } from '@navikt/aksel-icons';
import { Hr } from ".";
import { MenuLogoutButton } from "./NavigationDropdownMenu";
import { DropdownSubMenuProps } from "./NavigationDropdownSubMenu";
import { useSavedSearches } from "../../pages/SavedSearches";
import { SavedSearchesFieldsFragment } from "bff-types-generated";
import { NavigationDropdownMenuItem } from "./NavigationDropdownMenuItem";
import { useParties } from "../../api/useParties";
import { useDialogs } from "../../api/useDialogs";


export const NavigationDropdownSubMenuInbox: React.FC<DropdownSubMenuProps> = ({ onClose, onBack }) => {
  const { t } = useTranslation();
  const { data } = useSavedSearches();
  const savedSearches = data?.savedSearches as SavedSearchesFieldsFragment[];
  const { parties } = useParties();
  const { dialogsByView } = useDialogs(parties);

  return (
    <div className={styles.menuItems}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <div role="button" tabIndex={0} className={styles.menuColumn} onClick={onBack} >
            <ArrowLeftIcon className={styles.backButtonIcon} /><span className={styles.subMenuTitle}>{t('word.main_menu')}</span>
          </div>
        </li>
        <Hr />
        <NavigationDropdownMenuItem displayText={t('sidebar.inbox')} label={t('sidebar.inbox.label')} icon={<InboxFillIcon />} count={dialogsByView['inbox'].length} path="/inbox" />
        <Hr />
        <NavigationDropdownMenuItem displayText={t('sidebar.drafts')} label={t('sidebar.drafts.label')} icon={<FileTextIcon />} count={dialogsByView['draft'].length} path="/drafts" onClick={onClose} />
        <NavigationDropdownMenuItem displayText={t('sidebar.sent')} label={t('sidebar.sent.label')} icon={<FileCheckmarkIcon />} count={dialogsByView['sent'].length} path="/sent" onClick={onClose} />
        <NavigationDropdownMenuItem displayText={t('sidebar.archived')} label={t('sidebar.archived.label')} icon={<FolderMinusIcon />} count={8} path="/archive" onClick={onClose} />
        <NavigationDropdownMenuItem displayText={t('sidebar.deleted')} label={t('sidebar.deleted.label')} icon={<TrashIcon />} count={8} path="/deleted" />
        <Hr />
        <NavigationDropdownMenuItem displayText={t('sidebar.saved_searches')} label={t('sidebar.saved_searches.label')} icon={<MagnifyingGlassIcon />} count={savedSearches?.length || 0} path="/saved-searches" />
        <NavigationDropdownMenuItem displayText={t('sidebar.settings')} label={t('sidebar.settings.label')} icon={<CogIcon />} path="/innstillinger" />
        <Hr />
        <MenuLogoutButton />
      </ul>
    </div>
  )
}
