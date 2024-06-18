import cx from 'classnames';
import styles from './dropdownList.module.css';

interface DropdownListProps {
  children: React.ReactNode;
  className?: string;
}
export const DropdownList = ({ children, className }: DropdownListProps) => {
  return <ul className={cx(styles.dropdownList, className)}>{children}</ul>;
};
