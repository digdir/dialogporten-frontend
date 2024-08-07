import { useMemo } from 'react';
import { getPredefinedRange } from '../../../components/FilterBar/dateInfo.ts';
import styles from './searchFilterTag.module.css';

interface SearchFilterTagProps {
  searchValue: string | undefined | null;
  searchId: string | undefined | null;
  index: number;
}
const SearchFilterTag = ({ searchId, searchValue, index }: SearchFilterTagProps) => {
  const predefinedRange = useMemo(
    () => getPredefinedRange().find((range) => range.value === searchValue),
    [searchValue],
  );

  const value = useMemo(
    () => (predefinedRange && searchId === 'created' ? predefinedRange.label : searchValue),
    [predefinedRange, searchId, searchValue],
  );

  return <span className={styles.searchFilterTag}>{`${index === 0 ? '' : ' +'} ${value ?? ''}`}</span>;
};

export default SearchFilterTag;
