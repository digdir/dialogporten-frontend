import cx from 'classnames';
import styles from './dropdownList.module.css';

interface DropdownListProps {
  children: React.ReactNode;
  variant?: 'short' | 'long';
  className?: string;
}
export const DropdownList = ({ children, className, variant = 'short' }: DropdownListProps) => {
  return <ul className={cx(styles.dropdownList, className, variant)}>{children}</ul>;
};
