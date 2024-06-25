import styles from './savedSearches.module.css';
import { Skeleton } from '@digdir/designsystemet-react';

interface SavedSearchesSkeletonProps {
  numberOfItems: number;
}

export const SavedSearchesSkeleton: React.FC<SavedSearchesSkeletonProps> = ({ numberOfItems }) => {
  return (
    <main>
      <section className={styles.savedSearchesWrapper}>
        <div className={styles.title}><Skeleton.Text width='140px' /></div>
        <div className={styles.savedSearchesContainer}>
          {Array.from({ length: numberOfItems }).map((_, index) => (
            <>
              <div className={styles.savedSearchItem} style={{ minHeight: 48 }} key={index}>
                <div className={styles.searchDetails}>
                  <Skeleton.Text width='140px' />
                </div>
              </div>
              <hr style={{ opacity: 0.4 }} />
            </>
          ))}
        </div>
        <div className={styles.lastUpdated}>
          <Skeleton.Text width='250px' />
        </div>
      </section>
    </main>
  );
};