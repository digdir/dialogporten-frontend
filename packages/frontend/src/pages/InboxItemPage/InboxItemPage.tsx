import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDialogById } from '../../api/useDialogById.tsx';
import { useParties } from '../../api/useParties.ts';
import { BackButton } from '../../components';
import { InboxItemDetail } from '../../components';
import styles from './inboxItemPage.module.css';

export const InboxItemPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { parties } = useParties();
  const { dialog, isLoading } = useDialogById(parties, id);

  if (isLoading) {
    // TODO: Replace with loader
    return null;
  }

  if (!dialog) {
    return (
      <main className={styles.itemInboxPage}>
        <p>{t('dialog.error_message')}</p>
      </main>
    );
  }

  return (
    <main className={styles.itemInboxPage}>
      <nav>
        <BackButton pathTo="/inbox/" />
      </nav>
      <InboxItemDetail dialog={dialog} />
    </main>
  );
};
