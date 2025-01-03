import { Fragment } from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './savedSearchesPage.module.css';

interface SavedSearchesSkeletonProps {
  numberOfItems: number;
}

export const SavedSearchesSkeleton: React.FC<SavedSearchesSkeletonProps> = ({ numberOfItems }) => {
  return (
    <main>
      <section className={styles.savedSearchesWrapper}>
        <div className={styles.title}>
          <Skeleton width="140px" />
        </div>
        <div className={styles.savedSearchesContainer}>
          {Array.from({ length: numberOfItems }).map((_, index) => (
            <Fragment key={index}>
              <div className={styles.savedSearchItem} style={{ minHeight: 48 }}>
                <div className={styles.searchDetails}>
                  <Skeleton width="140px" />
                </div>
              </div>
              <hr style={{ opacity: 0.4 }} />
            </Fragment>
          ))}
        </div>
        <div className={styles.lastUpdated}>
          <Skeleton width="250px" />
        </div>
      </section>
    </main>
  );
};
