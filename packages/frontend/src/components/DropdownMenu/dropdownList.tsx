import cx from 'classnames';
import styles from './dropdownList.module.css';

interface DropdownListProps {
  children: React.ReactNode;
  isExpanded: boolean;
  className?: string;
  disableMobileDrawer?: boolean;
}

export const DropdownList = ({ children, className, isExpanded, disableMobileDrawer = false }: DropdownListProps) => {
  if (!isExpanded) {
    return null;
  }

  return (
    <ul
      className={cx(styles.dropdownList, className, {
        [styles.mobileDrawer]: !disableMobileDrawer,
      })}
    >
      {children}
    </ul>
  );
};
