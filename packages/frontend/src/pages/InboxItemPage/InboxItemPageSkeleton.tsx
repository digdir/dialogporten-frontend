import { Skeleton } from '@digdir/designsystemet-react';
import styles from './inboxItemPageSkeleton.module.css';

import { InboxSkeleton } from '../Inbox/InboxSkeleton';

export const InboxItemPageSkeleton = () => {

  return (
    <main className={styles.itemInboxPage}>
      <nav>
        <div className={styles.backLink}>
          <div className={styles.backButton}>
            <Skeleton.Rectangle width='130px' height='48px' />
          </div>
        </div>
      </nav>
      <Skeleton.Text className={styles.titleOne} height="2.5rem" width='25rem' />
      <Skeleton.Text width='15rem' className={styles.subTitle} />
      <InboxSkeleton numberOfItems={1} noBorder />
      <Skeleton.Text width='8.75rem' className={styles.titleTwo} />
    </main>
  );
};
