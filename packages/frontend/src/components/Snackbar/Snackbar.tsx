import { BellIcon, XMarkIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import type { ReactNode } from 'react';
import { BottomDrawer } from '../BottomDrawer';
import styles from './snackbar.module.css';
import { type SnackbarStoreRecord, useSnackbar } from './useSnackbar';

/**
 * Represents an individual snackbar message item.
 * @param {Object} props - Component props.
 * @param {SnackbarStoreRecord} props.item - The snackbar message item.
 * @param {Function} props.closeSnackbarItem - Function to close the snackbar message item.
 * @param {number} props.index - Index of the snackbar message item.
 * @returns {ReactNode} The ReactNode representing the snackbar message item.
 */
const SnackbarItem = ({
  item,
  closeSnackbarItem,
}: {
  item: SnackbarStoreRecord;
  closeSnackbarItem: (id: string) => void;
}): ReactNode => {
  return (
    <div className={cx(styles.snackbarItem, styles.bottomLeft, styles[item.variant])} key={item.id} aria-live="polite">
      <div className={styles.snackbarItemContent}>
        <span className={styles.leftIcon}>
          <BellIcon />
        </span>
        <span className={styles.message}>{item.message}</span>
        {item.dismissable && (
          <button
            type="button"
            className={styles.closeIcon}
            onClick={() => closeSnackbarItem(item.id)}
            onKeyUp={(e) => e.key === 'Enter' && closeSnackbarItem(item.id)}
          >
            <XMarkIcon />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Snackbar component. cf.`useSnackbar` for more info.
 * @returns {JSX.Element|null} The JSX element representing the snackbar or null if no messages are present.
 */
export const Snackbar = (): ReactNode => {
  const { storedMessages, closeSnackbarItem } = useSnackbar();
  return (
    <BottomDrawer>
      {(storedMessages || []).map((item) => (
        <SnackbarItem key={item.id} item={item} closeSnackbarItem={closeSnackbarItem} />
      ))}
    </BottomDrawer>
  );
};
