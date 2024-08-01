import { Button } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import styles from './backButton.module.css';

interface BackButtonProps {
  pathTo: string;
}

export function BackButton({ pathTo }: BackButtonProps) {
  const { t } = useTranslation();
  return (
    <Link to={pathTo} rel="noreferrer" className={styles.backLink}>
      <Button color="neutral" variant="tertiary" className={styles.backButton}>
        <ArrowLeftIcon className={styles.backIcon} />
        {t('word.back')}
      </Button>
    </Link>
  );
}
