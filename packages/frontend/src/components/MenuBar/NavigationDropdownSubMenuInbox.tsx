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
import { useDialogs } from '../../api/useDialogs';
import { useParties } from '../../api/useParties';
import { useSavedSearches } from '../../pages/SavedSearches';
import { HorizontalLine } from '../HorizontalLine';
import { MenuItem } from './MenuItem';
import { MenuLogoutButton } from './NavigationDropdownMenu';
import type { DropdownSubMenuProps } from './NavigationDropdownSubMenu';
import styles from './navigationDropdownMenu.module.css';

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
        <MenuItem
          leftContent={
            <div
              role="button"
              tabIndex={0}
              className={styles.linkContent}
              onClick={onBack}
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onBack();
              }}
            >
              <ArrowLeftIcon className={styles.backButtonIcon} />
              <span className={styles.subMenuTitle}>{t('word.main_menu')}</span>
            </div>
          }
          isWhiteBackground
        />
        <HorizontalLine />
        <MenuItem
          displayText={t('sidebar.inbox')}
          label={t('sidebar.inbox.label')}
          icon={<InboxFillIcon />}
          count={dialogsByView.inbox.length}
          path="/"
          onClose={onClose}
          isActive={pathname === '/'}
          isWhiteBackground
          isInbox
        />
        <MenuItem
          displayText={t('sidebar.drafts')}
          label={t('sidebar.drafts.label')}
          icon={<DocPencilIcon />}
          count={dialogsByView.draft.length}
          path="/drafts"
          onClose={onClose}
          isActive={pathname === '/drafts'}
          onClick={onClose}
          isWhiteBackground
          smallText
        />
        <MenuItem
          displayText={t('sidebar.sent')}
          label={t('sidebar.sent.label')}
          icon={<FileCheckmarkIcon />}
          count={dialogsByView.sent.length}
          path="/sent"
          onClose={onClose}
          isActive={pathname === '/sent'}
          onClick={onClose}
          isWhiteBackground
          smallText
        />
        <HorizontalLine />

        <MenuItem
          displayText={t('sidebar.saved_searches')}
          label={t('sidebar.saved_searches.label')}
          icon={<BookmarkIcon />}
          count={savedSearches?.length ?? 0}
          path="/saved-searches"
          isActive={pathname === '/saved-searches'}
          onClose={onClose}
          isWhiteBackground
          smallText
        />
        <HorizontalLine />

        <MenuItem
          displayText={t('sidebar.archived')}
          label={t('sidebar.archived.label')}
          icon={<ArchiveIcon />}
          count={0}
          path="/archive"
          isActive={pathname === '/archive'}
          onClose={onClose}
          isWhiteBackground
          smallText
        />
        <MenuItem
          displayText={t('sidebar.deleted')}
          label={t('sidebar.deleted.label')}
          icon={<TrashIcon />}
          count={0}
          isActive={pathname === '/deleted'}
          path="/deleted"
          isWhiteBackground
          smallText
          onClose={onClose}
        />
        <HorizontalLine />

        <MenuLogoutButton />
      </ul>
    </div>
  );
};
