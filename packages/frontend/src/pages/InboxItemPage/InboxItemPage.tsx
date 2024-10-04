import { useParams } from 'react-router-dom';
import { useDialogById } from '../../api/useDialogById.tsx';
import { useDialogByIdSubscription } from '../../api/useDialogByIdSubscription.ts';
import { useParties } from '../../api/useParties.ts';
import { BackButton } from '../../components';
import { InboxItemDetail } from '../../components';
import { InboxItemPageSkeleton } from './InboxItemPageSkeleton.tsx';
import styles from './inboxItemPage.module.css';

export const InboxItemPage = () => {
  const { id } = useParams();
  const { parties } = useParties();
  const { dialog, isLoading } = useDialogById(parties, id);
  useDialogByIdSubscription(id, dialog?.dialogToken);

  if (isLoading) {
    return <InboxItemPageSkeleton />;
  }
  return (
    <main className={styles.itemInboxPage}>
      <section className={styles.itemInboxPageContent}>
        <nav className={styles.itemInboxNav}>
          <BackButton pathTo="/inbox/" />
        </nav>
        <InboxItemDetail dialog={dialog} />
      </section>
    </main>
  );
};
