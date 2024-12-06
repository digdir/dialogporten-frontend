import cx from 'classnames';
import styles from './background.module.css';

/* Needed for applying theme to components, like e.g. ProfileButton  */
export const Background: React.FC<{ children: React.ReactNode; isCompany: boolean }> = ({ children, isCompany }) => {
  return (
    <div
      data-testid="pageLayout-background"
      className={cx(styles.background, {
        [styles.isCompany]: isCompany,
      })}
    >
      {children}
    </div>
  );
};
