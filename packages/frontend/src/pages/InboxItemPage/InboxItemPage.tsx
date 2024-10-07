import { useQueryClient } from '@tanstack/react-query';
import { SystemLabel } from 'bff-types-generated';
import i18n from 'i18next';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { updateSystemLabel } from '../../api/queries.ts';
import { useDialogById } from '../../api/useDialogById.tsx';
import { useDialogByIdSubscription } from '../../api/useDialogByIdSubscription.ts';
import { useParties } from '../../api/useParties.ts';
import { BackButton, SnackbarDuration, useSnackbar } from '../../components';
import { InboxItemDetail } from '../../components';
import { DialogToolbar } from '../../components/DialogToolbar/DialogToolbar.tsx';
import { QUERY_KEYS } from '../../constants/queryKeys.ts';
import { InboxItemPageSkeleton } from './InboxItemPageSkeleton.tsx';
import styles from './inboxItemPage.module.css';

export const InboxItemPage = () => {
  const { id } = useParams();
  const { parties } = useParties();
  const { dialog, isLoading } = useDialogById(parties, id);
  const [archiveLoading, setArchiveLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [undoLoading, setUndoLoading] = useState<boolean>(false);
  const { openSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  useDialogByIdSubscription(id, dialog?.dialogToken);

  const handleMoveDialog = async ({
    id,
    toLabel,
    successMessageKey,
    failureMessageKey,
    setLoading,
  }: {
    id: string;
    toLabel: SystemLabel;
    successMessageKey: string;
    failureMessageKey: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    try {
      setLoading(true);
      await updateSystemLabel(id, toLabel);
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DIALOGS] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DIALOG_BY_ID] });
      openSnackbar({
        message: i18n.t(successMessageKey),
        duration: SnackbarDuration.normal,
        variant: 'success',
      });
    } catch (error) {
      openSnackbar({
        message: i18n.t(failureMessageKey),
        duration: SnackbarDuration.normal,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUndoMoving = async (id: string) => {
    await handleMoveDialog({
      id,
      toLabel: SystemLabel.Default,
      successMessageKey: 'dialog.toolbar.toast.move_to_inbox_success',
      failureMessageKey: 'dialog.toolbar.toast.move_to_inbox_failed',
      setLoading: setUndoLoading,
    });
  };

  const handleMoveDialogToArchive = async (id: string) => {
    await handleMoveDialog({
      id,
      toLabel: SystemLabel.Archive,
      successMessageKey: 'dialog.toolbar.toast.move_to_archive_success',
      failureMessageKey: 'dialog.toolbar.toast.move_to_archive_failed',
      setLoading: setArchiveLoading,
    });
  };

  const handleMoveDialogBin = async (id: string) => {
    await handleMoveDialog({
      id,
      toLabel: SystemLabel.Bin,
      successMessageKey: 'dialog.toolbar.toast.move_to_bin_success',
      failureMessageKey: 'dialog.toolbar.toast.move_to_bin_failed',
      setLoading: setDeleteLoading,
    });
  };

  if (isLoading) {
    return <InboxItemPageSkeleton />;
  }

  return (
    <main className={styles.itemInboxPage}>
      <section className={styles.itemInboxPageContent}>
        <nav className={styles.itemInboxNav}>
          <BackButton pathTo="/inbox/" />
        </nav>
        <InboxItemDetail dialog={dialog} />
      </section>
      {id && dialog && (
        <DialogToolbar
          currentLabel={dialog.label}
          archiveAction={{ onClick: () => handleMoveDialogToArchive(id), isLoading: archiveLoading }}
          deleteAction={{ onClick: () => handleMoveDialogBin(id), isLoading: deleteLoading }}
          undoAction={{ onClick: () => handleUndoMoving(id), isLoading: undoLoading }}
        />
      )}
    </main>
  );
};
