import { Button } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '../MenuBar';
import styles from './menuLogoutButton.module.css';

export const MenuLogoutButton = () => {
  const { t } = useTranslation();
  const handleLogOut = () => {
    (window as Window).location = `/api/logout`;
  };
  return (
    <MenuItem
      leftContent={
        <Button variant="secondary" className={styles.menuLogoutButton} onClick={handleLogOut}>
          {t('word.log_out')}
        </Button>
      }
    />
  );
};
