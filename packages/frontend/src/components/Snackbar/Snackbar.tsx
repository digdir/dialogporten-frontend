import { BellIcon, XMarkIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import styles from './snackbar.module.css';
import { SnackbarStoreRecord, useSnackbar } from './useSnackbar';

/**
 * Represents an individual snackbar message item.
 * @param {Object} props - Component props.
 * @param {SnackbarStoreRecord} props.item - The snackbar message item.
 * @param {Function} props.closeSnackbarItem - Function to close the snackbar message item.
 * @param {number} props.index - Index of the snackbar message item.
 * @returns {JSX.Element} The JSX element representing the snackbar message item.
 */
const SnackbarItem = ({
  item,
  closeSnackbarItem,
  index,
}: {
  item: SnackbarStoreRecord;
  closeSnackbarItem: (id: string) => void;
  index: number;
}): JSX.Element => {
  return (
    <div
      className={cx(styles.snackbarItem, styles.bottomLeft, styles[item.variant])}
      key={item.id}
      role="status"
      aria-live="polite"
      style={{ marginBottom: `${70 * index}px` }}
    >
      <div className={styles.snackbarItemContent}>
        <span className={styles.leftIcon} onClick={() => closeSnackbarItem(item.id)}>
          <BellIcon />
        </span>
        <span className={styles.message}>{item.message}</span>
        {item.dismissable && (
          <span className={styles.closeIcon} onClick={() => closeSnackbarItem(item.id)}>
            <XMarkIcon />
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Snackbar component. cf.`useSnackbar` for more info.
 * @returns {JSX.Element|null} The JSX element representing the snackbar or null if no messages are present.
 */
export const Snackbar = (): JSX.Element | null => {
  const { isOpen, storedMessages, closeSnackbarItem } = useSnackbar();
  if (isOpen) {
    return (
      <div className={styles.snackbar}>
        {storedMessages.map((item, index) => (
          <SnackbarItem key={item.id} item={item} closeSnackbarItem={closeSnackbarItem} index={index} />
        ))}
      </div>
    );
  }
  return null;
};
