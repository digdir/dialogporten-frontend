import styles from './backdrop.module.css';

interface BackdropProps {
  show: boolean;
  clicked: () => void;
}

export const Backdrop = ({ show, clicked }: BackdropProps) => {
  if (!show) return null;
  return <div className={styles.backdrop} onClick={clicked} />;
};