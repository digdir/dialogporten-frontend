import {
  ArchiveIcon,
  ArrowLeftIcon,
  BookmarkIcon,
  DocPencilIcon,
  FileCheckmarkIcon,
  InboxFillIcon,
  TrashIcon,
} from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { Routes } from '../../pages/Inbox/Inbox';
import { useSavedSearches } from '../../pages/SavedSearches/useSavedSearches.ts';
import { HorizontalLine } from '../HorizontalLine';
import { MenuItem } from '../MenuBar';
import { MenuLogoutButton } from './MenuLogoutButton.tsx';
import type { DropdownSubMenuProps } from './NavigationDropdownSubMenu.tsx';

import styles from './navigationDropdownMenu.module.css';

export const NavigationDropdownSubMenuInbox: React.FC<DropdownSubMenuProps> = ({ onClose, onBack }) => {
  const { t } = useTranslation();
  const { savedSearches } = useSavedSearches();
  const { pathname } = useLocation();
  const { parties } = useParties();
  const { dialogsByView } = useDialogs(parties);

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
        <MenuItem
          displayText={t('sidebar.inbox')}
          toolTipText={t('sidebar.inbox.label')}
          leftIcon={<InboxFillIcon />}
          count={dialogsByView.inbox.length}
          path={Routes.inbox}
          isActive={pathname === Routes.inbox}
          onClick={onClose}
          isInbox
        />
        <HorizontalLine />
        <MenuItem
          displayText={t('sidebar.drafts')}
          toolTipText={t('sidebar.drafts.label')}
          leftIcon={<DocPencilIcon />}
          count={dialogsByView.drafts.length}
          path={Routes.drafts}
          isActive={pathname === Routes.drafts}
          onClick={onClose}
        />
        <MenuItem
          displayText={t('sidebar.sent')}
          toolTipText={t('sidebar.sent.label')}
          leftIcon={<FileCheckmarkIcon />}
          count={dialogsByView.sent.length}
          path={Routes.sent}
          isActive={pathname === Routes.sent}
          onClick={onClose}
        />
        <HorizontalLine />
        <MenuItem
          displayText={t('sidebar.saved_searches')}
          toolTipText={t('sidebar.saved_searches.label')}
          leftIcon={<BookmarkIcon />}
          count={savedSearches?.length ?? 0}
          path={Routes.savedSearches}
          isActive={pathname === Routes.savedSearches}
          onClick={onClose}
        />
        <HorizontalLine />
        <MenuItem
          displayText={t('sidebar.archived')}
          toolTipText={t('sidebar.archived.label')}
          leftIcon={<ArchiveIcon />}
          count={0}
          path={Routes.archive}
          isActive={pathname === Routes.archive}
          disabled
          onClick={onClose}
        />
        <MenuItem
          displayText={t('sidebar.deleted')}
          toolTipText={t('sidebar.deleted.label')}
          leftIcon={<TrashIcon />}
          count={0}
          isActive={pathname === Routes.bin}
          path={Routes.bin}
          disabled
          onClick={onClose}
        />
        <HorizontalLine />
        <MenuLogoutButton />
      </ul>
    </div>
  );
};
