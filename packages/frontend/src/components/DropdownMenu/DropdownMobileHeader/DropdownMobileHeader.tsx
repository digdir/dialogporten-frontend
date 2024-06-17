import { Button } from '@digdir/designsystemet-react';
import type { ReactNode } from 'react';
import styles from './dropdownMobileHeader.module.css';

interface DropDownMobileHeaderProps {
  onClickButton: () => void;
  buttonText: string;
  buttonIcon: ReactNode;
}

export const DropdownMobileHeader = ({ onClickButton, buttonIcon, buttonText }: DropDownMobileHeaderProps) => {
  return (
    <div className={styles.dropdownMobileHeader}>
      <Button variant="tertiary" onClick={onClickButton}>
        {buttonIcon} {buttonText}
      </Button>
    </div>
  );
};
