import cx from 'classnames';
import styles from './dropdownList.module.css';

interface DropdownListProps {
  children: React.ReactNode;
  isExpanded: boolean;
  variant?: 'short' | 'medium' | 'long';
  className?: string;
  disableMobileDrawer?: boolean;
}

export const DropdownList = ({
  children,
  className,
  variant = 'short',
  isExpanded,
  disableMobileDrawer = false,
}: DropdownListProps) => {
  if (!isExpanded) {
    return null;
  }

  return (
    <ul
      className={cx(styles.dropdownList, className, {
        [styles.short]: variant === 'short',
        [styles.short]: variant === 'medium',
        [styles.long]: variant === 'long',
        [styles.mobileDrawer]: !disableMobileDrawer,
      })}
    >
      {children}
    </ul>
  );
};
