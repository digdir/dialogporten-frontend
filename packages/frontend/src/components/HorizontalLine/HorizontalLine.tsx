import styles from './horizontalLine.module.css';

export const HorizontalLine = ({ fullWidth = true }) => (
  <hr className={styles.horizontalLine} style={fullWidth ? { width: '100%', margin: '0.5rem 0' } : {}} />
);
