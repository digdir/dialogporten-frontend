import {
  ArchiveIcon,
  ArrowLeftIcon,
  BookmarkIcon,
  DocPencilIcon,
  FileCheckmarkIcon,
  InboxFillIcon,
  TrashIcon,
} from '@navikt/aksel-icons';
import type { SavedSearchesFieldsFragment } from 'bff-types-generated';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Hr } from '.';
import { useDialogs } from '../../api/useDialogs';
import { useParties } from '../../api/useParties';
import { useSavedSearches } from '../../pages/SavedSearches';
import { MenuLogoutButton } from './NavigationDropdownMenu';
import { NavigationDropdownMenuItem } from './NavigationDropdownMenuItem';
import type { DropdownSubMenuProps } from './NavigationDropdownSubMenu';
import styles from './navigationMenu.module.css';

export const NavigationDropdownSubMenuInbox: React.FC<DropdownSubMenuProps> = ({ onClose, onBack }) => {
  const { t } = useTranslation();
  const { data } = useSavedSearches();
  const { pathname } = useLocation();
  const savedSearches = data?.savedSearches as SavedSearchesFieldsFragment[];
  const { parties } = useParties();
  const { dialogsByView } = useDialogs(parties);

  return (
    <div className={styles.menuItems}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <div role="button" tabIndex={0} className={styles.menuColumn} onClick={onBack}>
            <ArrowLeftIcon className={styles.backButtonIcon} />
            <span className={styles.subMenuTitle}>{t('word.main_menu')}</span>
          </div>
        </li>
        <Hr />
        <NavigationDropdownMenuItem
          displayText={t('sidebar.inbox')}
          label={t('sidebar.inbox.label')}
          icon={<InboxFillIcon />}
          count={dialogsByView.inbox.length}
          path="/"
          isActive={pathname === '/'}
        />
        <Hr />
        <NavigationDropdownMenuItem
          displayText={t('sidebar.drafts')}
          label={t('sidebar.drafts.label')}
          icon={<DocPencilIcon />}
          count={dialogsByView.draft.length}
          path="/drafts"
          isActive={pathname === '/drafts'}
          onClick={onClose}
        />
        <NavigationDropdownMenuItem
          displayText={t('sidebar.sent')}
          label={t('sidebar.sent.label')}
          icon={<FileCheckmarkIcon />}
          count={dialogsByView.sent.length}
          path="/sent"
          isActive={pathname === '/sent'}
          onClick={onClose}
        />
        <Hr />
        <NavigationDropdownMenuItem
          displayText={t('sidebar.saved_searches')}
          label={t('sidebar.saved_searches.label')}
          icon={<BookmarkIcon />}
          count={savedSearches?.length ?? 0}
          path="/saved-searches"
          isActive={pathname === '/saved-searches'}
        />
        <Hr />
        <NavigationDropdownMenuItem
          displayText={t('sidebar.archived')}
          label={t('sidebar.archived.label')}
          icon={<ArchiveIcon />}
          count={0}
          path="/archive"
          isActive={pathname === '/archive'}
          onClick={onClose}
        />
        <NavigationDropdownMenuItem
          displayText={t('sidebar.deleted')}
          label={t('sidebar.deleted.label')}
          icon={<TrashIcon />}
          count={0}
          isActive={pathname === '/deleted'}
          path="/deleted"
        />
        <Hr />
        <MenuLogoutButton />
      </ul>
    </div>
  );
};
