import { Modal } from '@digdir/designsystemet-react';
import type React from 'react';
import { Backdrop } from '.';
import styles from './backdrop.module.css';

type ModalProps = Parameters<typeof Modal>[0];

type Props = {
  open: boolean;
  children?: React.ReactChild | React.ReactChild[];
} & ModalProps;

/*
 *  Wrapper component that adds a backdrop and fixes z-index
 */
export const ModalWithBackdrop = ({ children, open, ...props }: Props) => {
  const onClose = () => {
    if (typeof props.onClose === 'function') {
      props.onClose();
    }
  };

  return (
    <>
      <Modal open={open} className={styles.zIndexFix} {...props}>
        {children}
      </Modal>
      <Backdrop show={open} onClick={onClose} />
    </>
  );
};