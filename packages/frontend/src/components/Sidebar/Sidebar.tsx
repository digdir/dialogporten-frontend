import {
  CogIcon,
  FileCheckmarkIcon,
  FileTextIcon,
  FolderMinusIcon,
  InboxFillIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
} from '@navikt/aksel-icons';
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
  const { data: savedSearches } = useSavedSearches();
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
            displayText={t('sidebar.new_form')}
            label="Trykk her for å lage nytt skjema"
            icon={<PlusIcon />}
            path="/Nytt"
            isButton
            isCompany={isCompany}
          />
          <SidebarItem
            displayText={t('sidebar.drafts')}
            label="Trykk her for å gå til Utkast"
            icon={<FileTextIcon />}
            count={8}
            path="/Utkast"
            isCompany={isCompany}
          />
          <SidebarItem
            displayText={t('sidebar.sent')}
            label="Trykk her for å gå til Sendt"
            icon={<FileCheckmarkIcon />}
            count={8}
            path="/Sendt"
            isCompany={isCompany}
          />
          <HorizontalLine />
          <SidebarItem
            displayText={t('sidebar.archived')}
            label="Trykk her for å gå til Arkiv"
            icon={<FolderMinusIcon />}
            count={8}
            path="/Arkiv"
            isCompany={isCompany}
          />
          <SidebarItem
            displayText={t('sidebar.deleted')}
            label="Trykk her for å gå til Slettet"
            icon={<TrashIcon />}
            count={8}
            path="/Slettet"
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
