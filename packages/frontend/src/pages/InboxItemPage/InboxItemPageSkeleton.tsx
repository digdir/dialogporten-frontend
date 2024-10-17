import Skeleton from 'react-loading-skeleton';
import { InboxSkeleton } from '../Inbox/InboxSkeleton';
import styles from './inboxItemPageSkeleton.module.css';

export const InboxItemPageSkeleton = () => {
  return (
    <main className={styles.itemInboxPage}>
      <nav>
        <div className={styles.backLink}>
          <div className={styles.backButton}>
            <Skeleton width="130px" height="48px" />
          </div>
        </div>
      </nav>
      <Skeleton className={styles.titleOne} height="2.5rem" width="25rem" />
      <Skeleton width="15rem" className={styles.subTitle} />
      <InboxSkeleton numberOfItems={1} noBorder />
      <Skeleton width="8.75rem" className={styles.titleTwo} />
    </main>
  );
};
