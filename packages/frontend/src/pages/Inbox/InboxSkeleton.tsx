import { Skeleton } from '@digdir/designsystemet-react';
import { InboxItems } from '../../components';
import styles from '../../components/InboxItem/inboxItem.module.css';
import cx from 'classnames';

interface InboxSkeletonProps {
  numberOfItems: number;
  withHeader?: boolean;
  noBorder?: boolean;
}

export const InboxSkeleton: React.FC<InboxSkeletonProps> = ({
  numberOfItems,
  withHeader = false,
  noBorder = false,
}) => {
  return (
    <>
      <InboxItems>
        {withHeader && (
          <header className={styles.inboxItemsHeader}>
            <h2>
              <Skeleton.Text width="80px" />
            </h2>
          </header>
        )}
        {Array.from({ length: numberOfItems }).map((_, index) => (
          <li
            key={index}
            className={cx(styles.inboxItemWrapper, { [styles.noBorder]: noBorder })}
            style={{ minHeight: 196 }}
          >
            <section className={styles.inboxItem}>
              <header className={styles.header}>
                <h2 className={styles.title}>
                  <Skeleton.Text width="400px" height="24px" />
                </h2>
              </header>
              <Skeleton.Text width="40%" height="36px" className={styles.description} />
              <Skeleton.Text width="100%" className={styles.description} />
              <div className={styles.participants}>
                <div className={styles.sender}>
                  <span>
                    <Skeleton.Text width="80px" />
                  </span>
                </div>
                <span>
                  <Skeleton.Text width="80px" />
                </span>
                <div className={styles.receiver}>
                  <span>
                    <Skeleton.Text width="80px" />
                  </span>
                </div>
              </div>
            </section>
          </li>
        ))}
      </InboxItems>
    </>
  );
};
