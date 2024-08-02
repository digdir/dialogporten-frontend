import { Modal, type ModalDialogProps } from '@digdir/designsystemet-react';
import type React from 'react';
import { Backdrop } from '.';
import styles from './backdrop.module.css';

type Props = {
  open: boolean;
  children?: React.ReactElement | React.ReactElement[];
} & ModalDialogProps;

/*
 *  Wrapper component that adds a backdrop and fixes z-index
 */
export const ModalWithBackdrop = ({ children, open, ...props }: Props) => {
  const onClose = () => {
    props.onClose?.();
  };

  return (
    <>
      <Modal.Dialog open={open} className={styles.zIndexFix} {...props}>
        {children}
      </Modal.Dialog>
      <Backdrop show={open} onClick={onClose} />
    </>
  );
};
