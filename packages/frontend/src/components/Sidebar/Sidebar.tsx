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

type SideBarView = InboxViewType | 'saved-searches' | 'archive' | 'deleted';

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
          label={t('sidebar.inbox.label')}
          icon={<InboxFillIcon />}
          count={itemsPerViewCount.inbox}
          path={Routes.inbox}
          isActive={pathname === Routes.inbox}
          isWhiteBackground
          isInbox
          largeText
        />
        <HorizontalLine />
        <MenuItem
          displayText={t('sidebar.drafts')}
          label={t('sidebar.drafts.label')}
          isWhiteBackground
          icon={<DocPencilIcon />}
          count={itemsPerViewCount.drafts}
          path={Routes.drafts}
          isActive={pathname === Routes.drafts}
        />
        <MenuItem
          displayText={t('sidebar.sent')}
          label={t('sidebar.sent.label')}
          icon={<FileCheckmarkIcon />}
          isWhiteBackground
          count={itemsPerViewCount.sent}
          path={Routes.sent}
          isActive={pathname === Routes.sent}
        />
        <HorizontalLine />
        <MenuItem
          displayText={t('sidebar.saved_searches')}
          label={t('sidebar.saved_searches.label')}
          icon={<BookmarkIcon />}
          isWhiteBackground
          count={itemsPerViewCount['saved-searches']}
          path={Routes.savedSearches}
          isActive={pathname === Routes.savedSearches}
        />
        <HorizontalLine />
        <MenuItem
          displayText={t('sidebar.archived')}
          label={t('sidebar.archived.label')}
          icon={<ArchiveIcon />}
          isWhiteBackground
          count={itemsPerViewCount.archive}
          path={Routes.archive}
          isActive={pathname === Routes.archive}
        />
        <MenuItem
          displayText={t('sidebar.deleted')}
          label={t('sidebar.deleted.label')}
          isWhiteBackground
          icon={<TrashIcon />}
          count={itemsPerViewCount.deleted}
          isActive={pathname === Routes.deleted}
          path={Routes.deleted}
          classNames={styles.lastItem}
        />
      </ul>
    </aside>
  );
};
