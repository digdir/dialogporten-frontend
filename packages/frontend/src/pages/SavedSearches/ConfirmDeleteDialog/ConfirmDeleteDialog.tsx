import { Button, Modal } from '@digdir/designsystemet-react';
import { type ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { deleteSavedSearch } from '../../../api/queries.ts';
import { HorizontalLine, useSnackbar } from '../../../components';

interface DeleteSearchDialogProps {
  savedSearchId?: number;
}

export type DeleteSearchDialogRef = {
  openDialog: () => void;
};

export const ConfirmDeleteDialog = forwardRef(
  ({ savedSearchId }: DeleteSearchDialogProps, ref: ForwardedRef<DeleteSearchDialogRef>) => {
    const { t } = useTranslation();
    const { openSnackbar } = useSnackbar();
    const deleteDialogRef = useRef<HTMLDialogElement>(null);
    const queryClient = useQueryClient();

    useImperativeHandle(ref, () => ({
      openDialog: () => {
        deleteDialogRef.current?.showModal();
      },
    }));

    const onClose = () => {
      deleteDialogRef.current?.close();
    };
    const handleDeleteSearch = async () => {
      if (typeof savedSearchId !== 'number') return;

      try {
        await deleteSavedSearch(savedSearchId);
        openSnackbar({
          message: t('savedSearches.deleted_success'),
          variant: 'success',
        });
        await queryClient.invalidateQueries('savedSearches');
      } catch (error) {
        console.error('Failed to delete saved search:', error);
        openSnackbar({
          message: t('savedSearches.delete_failed'),
          variant: 'error',
        });
      } finally {
        onClose();
      }
    };

    return (
      <Modal.Root>
        <Modal.Dialog ref={deleteDialogRef} onInteractOutside={onClose}>
          <Modal.Header>{t('savedSearches.confirm_delete_title')}</Modal.Header>
          <Modal.Content>
            <HorizontalLine />
            <p>{t('savedSearches.confirm_delete_body')}</p>
          </Modal.Content>
          <Modal.Footer>
            <Button onClick={handleDeleteSearch}>{t('savedSearches.buttons.confirm')}</Button>
            <Button variant="secondary" onClick={onClose}>
              {t('savedSearches.buttons.cancel')}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Root>
    );
  },
);
