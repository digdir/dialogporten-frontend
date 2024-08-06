import {
  ArchiveIcon,
  BookmarkIcon,
  DocPencilIcon,
  FileCheckmarkIcon,
  InboxFillIcon,
  TrashIcon,
} from '@navikt/aksel-icons';
import type { SavedSearchesFieldsFragment } from 'bff-types-generated';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useDialogs } from '../../api/useDialogs';
import { useParties } from '../../api/useParties';
import { Routes } from '../../pages/Inbox/Inbox';
import { useSavedSearches } from '../../pages/SavedSearches';
import { Hr } from '../MenuBar';
import { MenuItem } from '../MenuBar';
import styles from './sidebar.module.css';

export interface SidebarProps {
  children?: React.ReactNode;
  isCompany?: boolean;
}

export const HorizontalLine = ({ fullWidth = false }) => (
  <hr className={styles.horizontalLine} style={fullWidth ? { width: '100%', margin: '0.5rem 0' } : {}} />
);

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { data } = useSavedSearches();
  const savedSearches = data?.savedSearches as SavedSearchesFieldsFragment[];
  const { parties } = useParties();
  const { dialogsByView } = useDialogs(parties);

  return (
    <aside className={styles.sidebar} data-testid="sidebar">
      {children || (
        <ul className={styles.menuList}>
          <MenuItem
            displayText={t('sidebar.inbox')}
            label={t('sidebar.inbox.label')}
            icon={<InboxFillIcon />}
            count={dialogsByView.inbox.length}
            path="/"
            isActive={pathname === Routes.inbox}
            isWhiteBackground
            isInbox
          />
          <MenuItem
            displayText={t('sidebar.drafts')}
            label={t('sidebar.drafts.label')}
            isWhiteBackground
            icon={<DocPencilIcon />}
            count={dialogsByView.draft.length}
            path="/drafts"
            isActive={pathname === Routes.draft}
          />
          <MenuItem
            displayText={t('sidebar.sent')}
            label={t('sidebar.sent.label')}
            icon={<FileCheckmarkIcon />}
            isWhiteBackground
            count={dialogsByView.sent.length}
            path="/sent"
            isActive={pathname === Routes.sent}
          />
          <Hr />
          <MenuItem
            displayText={t('sidebar.saved_searches')}
            label={t('sidebar.saved_searches.label')}
            icon={<BookmarkIcon />}
            isWhiteBackground
            count={savedSearches?.length ?? 0}
            path="/saved-searches"
            isActive={pathname === Routes.savedSearches}
          />
          <Hr />
          <MenuItem
            displayText={t('sidebar.archived')}
            label={t('sidebar.archived.label')}
            icon={<ArchiveIcon />}
            isWhiteBackground
            count={0}
            path="/archive"
            isActive={pathname === Routes.archive}
          />
          <MenuItem
            displayText={t('sidebar.deleted')}
            label={t('sidebar.deleted.label')}
            isWhiteBackground
            icon={<TrashIcon />}
            count={0}
            isActive={pathname === Routes.deleted}
            path="/deleted"
          />
        </ul>
      )}
    </aside>
  );
};
