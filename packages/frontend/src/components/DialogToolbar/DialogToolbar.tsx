import { ArchiveIcon, InboxFillIcon, TrashIcon } from '@navikt/aksel-icons';
import { SystemLabel } from 'bff-types-generated';
import { useTranslation } from 'react-i18next';
import { ProfileButton } from '../ProfileButton';
import styles from './dialogToolbar.module.css';

interface ToolbarActionProps {
  onClick: () => void;
  isLoading: boolean;
}

interface DialogToolbarProps {
  archiveAction: ToolbarActionProps;
  deleteAction: ToolbarActionProps;
  undoAction: ToolbarActionProps;
  currentLabel: SystemLabel;
}

export const DialogToolbar = ({ archiveAction, deleteAction, undoAction, currentLabel }: DialogToolbarProps) => {
  const { t } = useTranslation();
  return (
    <section className={styles.dialogToolbar}>
      {[SystemLabel.Archive, SystemLabel.Bin].includes(currentLabel) && (
        <ProfileButton color="neutral" onClick={undoAction.onClick} isLoading={undoAction.isLoading}>
          <InboxFillIcon fontSize="1.5rem" />
          {t('dialog.toolbar.move_undo')}
        </ProfileButton>
      )}
      {currentLabel !== SystemLabel.Archive && (
        <ProfileButton color="neutral" onClick={archiveAction.onClick} isLoading={archiveAction.isLoading}>
          <ArchiveIcon fontSize="1.5rem" />
          {t('dialog.toolbar.move_to_archive')}
        </ProfileButton>
      )}
      {currentLabel !== SystemLabel.Bin && (
        <ProfileButton color="neutral" onClick={deleteAction.onClick} isLoading={deleteAction.isLoading}>
          <TrashIcon fontSize="1.5rem" />
          {t('dialog.toolbar.move_to_bin')}
        </ProfileButton>
      )}
    </section>
  );
};
