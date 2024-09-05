import {
  ArchiveIcon,
  BookmarkIcon,
  DocPencilIcon,
  FileCheckmarkIcon,
  InboxFillIcon,
  TrashIcon,
} from '@navikt/aksel-icons';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import type { InboxViewType } from '../../api/useDialogs.tsx';
import { Routes } from '../../pages/Inbox/Inbox';
import { HorizontalLine } from '../HorizontalLine/';
import { MenuItem } from '../MenuBar';
import styles from './sidebar.module.css';

export type SideBarView = InboxViewType | 'saved-searches' | 'archive' | 'deleted';

export type ItemPerViewCount = {
  [key in SideBarView]: number;
};
export interface SidebarProps {
  itemsPerViewCount: ItemPerViewCount;
  isCompany?: boolean;
}

/**
 * Sidebar component for displaying a navigational menu with various inbox-related views.
 *
 * @component
 *
 * @param {SidebarProps} props - The props for the Sidebar component.
 * @param {ItemPerViewCount} props.itemsPerViewCount - An object containing the count of items for each view.
 * @param {boolean} [props.isCompany] - Optional flag to indicate if the sidebar is being used in a company context.
 *
 * @returns {React.ReactElement} The rendered Sidebar component.
 *
 * @example
 * const itemsPerViewCount = {
 *   inbox: 10,
 *   drafts: 5,
 *   sent: 7,
 *   "saved-searches": 2,
 *   archive: 3,
 *   deleted: 1
 * };
 *
 * <Sidebar itemsPerViewCount={itemsPerViewCount} />
 */
export const Sidebar: React.FC<SidebarProps> = ({ itemsPerViewCount }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <aside className={styles.sidebar} data-testid="sidebar">
      <ul className={styles.sidebarUl}>
        <MenuItem
          displayText={t('sidebar.inbox')}
          toolTipText={t('sidebar.inbox.label')}
          leftIcon={<InboxFillIcon />}
          count={itemsPerViewCount.inbox}
          path={Routes.inbox}
          isActive={pathname === Routes.inbox}
          isWhiteBackground
          isInbox
          largeText
          useProfiledHover
        />
        <HorizontalLine />
        <MenuItem
          displayText={t('sidebar.drafts')}
          toolTipText={t('sidebar.drafts.label')}
          isWhiteBackground
          leftIcon={<DocPencilIcon />}
          count={itemsPerViewCount.drafts}
          path={Routes.drafts}
          isActive={pathname === Routes.drafts}
          useProfiledHover
        />
        <MenuItem
          displayText={t('sidebar.sent')}
          toolTipText={t('sidebar.sent.label')}
          leftIcon={<FileCheckmarkIcon />}
          isWhiteBackground
          count={itemsPerViewCount.sent}
          path={Routes.sent}
          isActive={pathname === Routes.sent}
          useProfiledHover
        />
        <HorizontalLine />
        <MenuItem
          displayText={t('sidebar.saved_searches')}
          toolTipText={t('sidebar.saved_searches.label')}
          leftIcon={<BookmarkIcon />}
          isWhiteBackground
          count={itemsPerViewCount['saved-searches']}
          path={Routes.savedSearches}
          isActive={pathname === Routes.savedSearches}
          useProfiledHover
        />
        <HorizontalLine />
        <MenuItem
          displayText={t('sidebar.archived')}
          toolTipText={t('sidebar.archived.label')}
          leftIcon={<ArchiveIcon />}
          isWhiteBackground
          count={itemsPerViewCount.archive}
          path={Routes.archive}
          isActive={pathname === Routes.archive}
          useProfiledHover
          disabled
        />
        <MenuItem
          displayText={t('sidebar.deleted')}
          toolTipText={t('sidebar.deleted.label')}
          isWhiteBackground
          leftIcon={<TrashIcon />}
          count={itemsPerViewCount.deleted}
          isActive={pathname === Routes.deleted}
          path={Routes.deleted}
          className={styles.lastItem}
          useProfiledHover
          disabled
        />
      </ul>
    </aside>
  );
};
