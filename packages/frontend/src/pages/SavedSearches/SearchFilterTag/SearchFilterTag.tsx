import { useMemo } from 'react';
import { getPredefinedRange } from '../../../components/FilterBar/dateInfo.ts';
import { PlusIcon } from '../../../components/Icons/PlusIcon/PlusIcon.tsx';
import styles from './searchFilterTag.module.css';

interface SearchFilterTagProps {
  searchValue: string | undefined | null;
  searchId: string | undefined | null;
  isLastItem: boolean;
}

const SearchFilterTag = ({ searchId, searchValue, isLastItem }: SearchFilterTagProps) => {
  const predefinedRange = useMemo(
    () => getPredefinedRange().find((range) => range.value === searchValue),
    [searchValue],
  );

  const value = useMemo(
    () => (predefinedRange && searchId === 'created' ? predefinedRange.label : searchValue),
    [predefinedRange, searchId, searchValue],
  );

  return (
    <div className={styles.searchFilterTagWrapper}>
      <div className={styles.searchFilterTag}>{`${value ?? ''}`}</div>
      {!isLastItem && <PlusIcon />}
    </div>
  );
};

export default SearchFilterTag;
