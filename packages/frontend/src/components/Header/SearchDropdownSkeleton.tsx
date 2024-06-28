import cx from 'classnames';
import styles from './search.module.css';

import { SearchDropdownItem } from './SearchDropdownItem';
import { Skeleton } from '@digdir/designsystemet-react';

interface SearchDropdownSkeletonProps {
  numberOfItems: number;
}

export const SearchDropdownSkeleton: React.FC<SearchDropdownSkeletonProps> = ({ numberOfItems }) => {
  return (
    <>
      {Array.from({ length: numberOfItems }).map((_, index) => (
        <SearchDropdownItem key={index}>
          <div style={{ width: '100%' }}>
            <Skeleton.Text width="40%" />
            <Skeleton.Text width="100%" />
          </div>
          <div className={cx(styles.rightContent)}>
            <span className={styles.timeSince}>
              <Skeleton.Text width="70%" />
            </span>
            <Skeleton.Circle width="20px" height="20px" style={{ marginRight: 12 }} />
          </div>
        </SearchDropdownItem>
      ))}
    </>
  );
};
