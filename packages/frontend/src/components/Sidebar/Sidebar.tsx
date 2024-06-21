import {
  CogIcon,
  FileCheckmarkIcon,
  FileTextIcon,
  FolderMinusIcon,
  InboxFillIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from '@navikt/aksel-icons';
import type { SavedSearchesFieldsFragment } from 'bff-types-generated';
import type React from 'react';
import { useTranslation } from 'react-i18next';
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
            icon={<InboxFillIcon />}
            count={dialogsByView.inbox.length}
            path="/"
            isInbox
            isCompany={isCompany}
          />
          <HorizontalLine />
          <SidebarItem
            displayText={t('sidebar.drafts')}
            label={t('sidebar.drafts.label')}
            icon={<FileTextIcon />}
            count={dialogsByView.draft.length}
            path="/drafts"
            isCompany={isCompany}
          />
          <SidebarItem
            displayText={t('sidebar.sent')}
            label={t('sidebar.sent.label')}
            icon={<FileCheckmarkIcon />}
            count={dialogsByView.sent.length}
            path="/sent"
            isCompany={isCompany}
          />
          <HorizontalLine />
          <SidebarItem
            disabled
            displayText={t('sidebar.archived')}
            label={t('sidebar.archived.label')}
            icon={<FolderMinusIcon />}
            count={8}
            path="/archive"
            isCompany={isCompany}
          />
          <SidebarItem
            disabled
            displayText={t('sidebar.deleted')}
            label={t('sidebar.deleted.label')}
            icon={<TrashIcon />}
            count={8}
            path="/deleted"
            isCompany={isCompany}
          />
          <HorizontalLine />
          <SidebarItem
            displayText={t('sidebar.saved_searches')}
            label={t('sidebar.saved_searches.label')}
            icon={<MagnifyingGlassIcon />}
            count={savedSearches?.length || 0}
            path="/saved-searches"
            type="secondary"
            isCompany={isCompany}
          />
          <SidebarItem
            disabled
            displayText={t('sidebar.settings')}
            label={t('sidebar.settings.label')}
            icon={<CogIcon />}
            path="/innstillinger"
            type="secondary"
            isCompany={isCompany}
          />
        </>
      )}
    </aside>
  );
};
