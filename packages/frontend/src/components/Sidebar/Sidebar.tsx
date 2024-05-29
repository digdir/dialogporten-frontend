import {
  CogIcon,
  FileCheckmarkIcon,
  FileTextIcon,
  FolderMinusIcon,
  InboxFillIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from '@navikt/aksel-icons';
import { SavedSearchesFieldsFragment } from 'bff-types-generated';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from '../../../utils/useWindowSize';
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

  if (isMobile) {
    return null;
  }

  return (
    <aside className={styles.sidebar}>
      {children || (
        <>
          <SidebarItem
            displayText={t('inbox.title')}
            label="Trykk her for å gå til innboks"
            icon={<InboxFillIcon />}
            count={3}
            path="/inbox"
            isInbox
            isCompany={isCompany}
          />
          <HorizontalLine />
          <SidebarItem
            displayText={t('sidebar.drafts')}
            label="Trykk her for å gå til Under arbeid"
            icon={<FileTextIcon />}
            count={8}
            path="/drafts"
            isCompany={isCompany}
          />
          <SidebarItem
            displayText={t('sidebar.sent')}
            label="Trykk her for å gå til Sendt"
            icon={<FileCheckmarkIcon />}
            count={8}
            path="/sent"
            isCompany={isCompany}
          />
          <HorizontalLine />
          <SidebarItem
            disabled
            displayText={t('sidebar.archived')}
            label="Trykk her for å gå til Arkiv"
            icon={<FolderMinusIcon />}
            count={8}
            path="/archive"
            isCompany={isCompany}
          />
          <SidebarItem
            disabled
            displayText={t('sidebar.deleted')}
            label="Trykk her for å gå til Papirkurv"
            icon={<TrashIcon />}
            count={8}
            path="/deleted"
            isCompany={isCompany}
          />
          <HorizontalLine />
          <SidebarItem
            displayText={t('sidebar.saved_searches')}
            label="Trykk her for å gå til lagrede søk"
            icon={<MagnifyingGlassIcon />}
            count={savedSearches?.length || 0}
            path="/saved-searches"
            type="secondary"
            isCompany={isCompany}
          />
          <SidebarItem
            disabled
            displayText={t('sidebar.settings')}
            label="Trykk her for å gå til innstillinger"
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
