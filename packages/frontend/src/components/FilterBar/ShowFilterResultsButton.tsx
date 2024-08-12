import { Button } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import styles from './showFilterResultsButton.module.css';

interface ShowFilterResultsButtonProps {
  show: boolean;
  onClick: () => void;
  resultsCount?: number;
}

export const ShowFilterResultsButton = ({ resultsCount, onClick, show = false }: ShowFilterResultsButtonProps) => {
  const { t } = useTranslation();

  if (!show) {
    return null;
  }

  return (
    <Button className={styles.showResultsButton} onClick={onClick}>
      {t('filter_bar.showResultsButton', { count: resultsCount ?? 0 })}
    </Button>
  );
};
