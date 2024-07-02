import { useTranslation } from 'react-i18next';
import styles from './showFilterResultsButton.module.css';
import { Button } from '@digdir/designsystemet-react';

interface ShowFilterResultsButtonProps {
  nResults?: number;
  onClick: () => void;
}

export const ShowFilterResultsButton = ({ nResults, onClick }: ShowFilterResultsButtonProps) => {
  const { t } = useTranslation();
  return (
    <Button className={styles.showResultsButton} onClick={onClick}>
      {t('filter_bar.showResultsButton', { count: nResults || 0 })}
    </Button>
  );
};
