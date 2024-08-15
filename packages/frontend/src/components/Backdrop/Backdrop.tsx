import styles from './backdrop.module.css';
import { useEscapeKey } from './useEscapeKey.ts';

interface BackdropProps {
  show: boolean;
  onClick: () => void;
}

export const Backdrop = ({ show, onClick }: BackdropProps) => {
  useEscapeKey(onClick);

  if (!show) return null;

  return <div className={styles.backdrop} onClick={onClick} onKeyUp={onClick} tabIndex={0} role="button" />;
};
