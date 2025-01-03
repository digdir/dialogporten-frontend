import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@digdir/designsystemet-react';
import styles from './backButton.module.css';

export function BackButton({ path }: { path: string }) {
  const { t } = useTranslation();
  return (
    <Link to={path} rel="noreferrer" className={styles.backLink}>
      <Button color="neutral" variant="tertiary" className={styles.backButton}>
        <ArrowLeftIcon className={styles.backIcon} />
        {t('word.back')}
      </Button>
    </Link>
  );
}
