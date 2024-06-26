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
import { useWindowSize } from '../../../utils/useWindowSize';
import { useDialogs } from '../../api/useDialogs';
import { useParties } from '../../api/useParties';
import { useSavedSearches } from '../../pages/SavedSearches';
import { SidebarItem } from './';
import styles from './sidebar.module.css';

export interface SidebarProps {
  children?: React.ReactNode;
  isCompany?: boolean;
}

export const HorizontalLine = () => <hr className={styles.horizontalLine} />;

export const Sidebar: React.FC<SidebarProps> = ({ children, isCompany }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { data } = useSavedSearches();
  const savedSearches = data?.savedSearches as SavedSearchesFieldsFragment[];
  const { isMobile } = useWindowSize();
  const { parties } = useParties();
  const { dialogsByView } = useDialogs(parties);

  if (isMobile) {
    return null;
  }

  return (
    <aside className={styles.sidebar} data-testid="sidebar">
      {children || (
        <>
          <SidebarItem
            displayText={t('sidebar.inbox')}
            label={t('sidebar.inbox.label')}
            icon={<InboxFillIcon fontSize="1.5rem" />}
            count={dialogsByView.inbox.filter((dialog) => !dialog.isSeenByEndUser).length}
            path="/"
            isInbox
            isActive={pathname === '/'}
            isCompany={isCompany}
          />
          <SidebarItem
            displayText={t('sidebar.drafts')}
            label={t('sidebar.drafts.label')}
            icon={<DocPencilIcon fontSize="1.5rem" />}
            count={dialogsByView.draft.length}
            path="/drafts"
            isActive={pathname === '/drafts'}
            isCompany={isCompany}
          />
          <SidebarItem
            displayText={t('sidebar.sent')}
            label={t('sidebar.sent.label')}
            icon={<FileCheckmarkIcon fontSize="1.5rem" />}
            count={dialogsByView.sent.length}
            path="/sent"
            isActive={pathname === '/sent'}
            isCompany={isCompany}
          />
          <HorizontalLine />
          <SidebarItem
            displayText={t('sidebar.saved_searches')}
            label={t('sidebar.saved_searches.label')}
            icon={<BookmarkIcon fontSize="1.5rem" />}
            count={savedSearches?.length || 0}
            path="/saved-searches"
            isActive={pathname === '/saved-searches'}
            type="secondary"
            isCompany={isCompany}
          />
          <HorizontalLine />
          <SidebarItem
            disabled
            displayText={t('sidebar.archived')}
            label={t('sidebar.archived.label')}
            icon={<ArchiveIcon fontSize="1.5rem" />}
            count={8}
            path="/archive"
            isActive={pathname === '/archive'}
            isCompany={isCompany}
          />
          <SidebarItem
            disabled
            displayText={t('sidebar.deleted')}
            label={t('sidebar.deleted.label')}
            icon={<TrashIcon fontSize="1.5rem" />}
            count={8}
            path="/deleted"
            isActive={pathname === '/deleted'}
            isCompany={isCompany}
          />
        </>
      )}
    </aside>
  );
};
