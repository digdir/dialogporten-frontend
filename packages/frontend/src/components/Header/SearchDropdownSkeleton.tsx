import cx from 'classnames';
import styles from './search.module.css';

import Skeleton from 'react-loading-skeleton';
import { SearchDropdownItem } from './SearchDropdownItem';

interface SearchDropdownSkeletonProps {
  numberOfItems: number;
}

export const SearchDropdownSkeleton: React.FC<SearchDropdownSkeletonProps> = ({ numberOfItems }) => {
  return (
    <div>
      {Array.from({ length: numberOfItems }).map((_, index) => (
        <SearchDropdownItem key={`${index}-search-result`}>
          <div style={{ width: '100%' }}>
            <Skeleton width="40%" />
            <Skeleton width="100%" />
          </div>
          <div className={cx(styles.rightContent)}>
            <span className={styles.timeSince}>
              <Skeleton width="70%" />
            </span>
            <Skeleton width="20px" height="20px" circle style={{ marginRight: 12 }} />
          </div>
        </SearchDropdownItem>
      ))}
    </div>
  );
};
