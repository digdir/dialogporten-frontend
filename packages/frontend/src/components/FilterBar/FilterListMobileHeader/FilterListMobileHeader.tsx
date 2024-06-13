import { Button } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import styles from './filterListMobileHeader.module.css';

interface FilterListMobileHeaderProps {
  onClickButton: () => void;
  buttonText: string;
  buttonIcon: ReactNode;
}

export const FilterListMobileHeader = ({ onClickButton, buttonIcon, buttonText }: FilterListMobileHeaderProps) => {
  return (
    <div className={styles.filterListMobileHeader}>
      <Button variant="tertiary" onClick={onClickButton}>
        {buttonIcon} {buttonText}
      </Button>
    </div>
  );
};
