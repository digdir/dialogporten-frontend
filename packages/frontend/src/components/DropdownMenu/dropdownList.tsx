import cx from 'classnames';
import styles from './dropdownList.module.css';

interface DropdownListProps {
  children: React.ReactNode;
  variant?: 'short' | 'medium' | 'long';
  className?: string;
}

export const DropdownList = ({ children, className, variant = 'short' }: DropdownListProps) => {
  return (
    <ul
      className={cx(styles.dropdownList, className, {
        [styles.short]: variant === 'short',
        [styles.short]: variant === 'medium',
        [styles.long]: variant === 'long',
      })}
    >
      {children}
    </ul>
  );
};
