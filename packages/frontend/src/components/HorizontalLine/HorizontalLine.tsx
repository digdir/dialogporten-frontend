import cx from 'classnames';
import styles from './horizontalLine.module.css';

export const HorizontalLine = ({ fullWidth = true }) => (
  <hr className={cx(styles.horizontalLine, { [styles.fullWidth]: fullWidth })} />
);
