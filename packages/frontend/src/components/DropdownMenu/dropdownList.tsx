import styles from './dropdownList.module.css';

interface DropdownListProps {
  children: React.ReactNode;
}
export const DropdownList = ({ children }: DropdownListProps) => {
  return <ul className={styles.dropdownList}>{children}</ul>;
};
