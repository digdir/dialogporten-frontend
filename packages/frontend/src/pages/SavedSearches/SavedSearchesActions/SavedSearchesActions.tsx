import { Button } from '@digdir/designsystemet-react';
import { MenuElipsisHorizontalIcon, TrashIcon } from '@navikt/aksel-icons';
import { PencilIcon } from '@navikt/aksel-icons';
import type { SavedSearchesFieldsFragment } from 'bff-types-generated';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DropdownList, HorizontalLine } from '../../../components';
import { useClickoutside } from '../../../components/Backdrop/useClickOutside.ts';
import { useEscapeKey } from '../../../components/Backdrop/useEscapeKey.ts';
import { MenuItem } from '../../../components/MenuBar';
import styles from './savedSearchesActions.module.css';

interface SaveSearchesActionsProps {
  savedSearch: SavedSearchesFieldsFragment;
  onDeleteBtnClick?: (savedSearchToDelete: SavedSearchesFieldsFragment) => void;
  onEditBtnClick?: (savedSearch: SavedSearchesFieldsFragment) => void;
}
export const SaveSearchesActions = ({ savedSearch, onDeleteBtnClick, onEditBtnClick }: SaveSearchesActionsProps) => {
  const { t } = useTranslation();
  useEscapeKey(() => setIsMenuOpen(false));
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleOpenEditModal = () => {
    onEditBtnClick?.(savedSearch);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    onDeleteBtnClick?.(savedSearch);
    setIsMenuOpen(false);
  };

  const ref = useClickoutside(() => {
    setIsMenuOpen(false);
  });

  return (
    <div className={styles.savedSearchesActions} ref={ref}>
      <Button
        type="button"
        variant="tertiary"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={styles.triggerButton}
      >
        <MenuElipsisHorizontalIcon className={styles.icon} />
      </Button>
      <DropdownList variant="medium" isExpanded={isMenuOpen} disableMobileDrawer className={styles.contextMenu}>
        <MenuItem
          onClick={handleOpenEditModal}
          leftContent={
            <MenuItem.LeftContent>
              <div className={styles.leftInnerContent}>
                <PencilIcon className={styles.icon} />
                <span>{t('savedSearches.change_name')}</span>
              </div>
            </MenuItem.LeftContent>
          }
          count={0}
        />
        <HorizontalLine />
        <MenuItem
          onClick={handleDelete}
          leftContent={
            <MenuItem.LeftContent>
              <div className={styles.leftInnerContent}>
                <TrashIcon className={styles.icon} />
                <span>{t('savedSearches.delete_search')}</span>
              </div>
            </MenuItem.LeftContent>
          }
          count={0}
        />
      </DropdownList>
    </div>
  );
};
