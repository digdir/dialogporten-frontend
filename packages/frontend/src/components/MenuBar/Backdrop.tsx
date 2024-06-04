import styles from './backdrop.module.css';

interface BackdropProps {
  show: boolean;
  onClick: () => void;
}

export const Backdrop = ({ show, onClick }: BackdropProps) => {
  if (!show) return null;
  return <div className={styles.backdrop} onClick={onClick} />;
};