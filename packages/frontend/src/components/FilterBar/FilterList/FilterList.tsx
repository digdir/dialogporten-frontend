import styles from './filterList.module.css';

interface FilterListProps {
  children: React.ReactNode;
}
export const FilterList = ({ children }: FilterListProps) => {
  return <ul className={styles.filterList}>{children}</ul>;
};
