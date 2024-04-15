import { Button } from '@digdir/designsystemet-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';

type SaveSearchButtonProps = {
  onBtnClick: () => void;
  disabled?: boolean;
};

export const SaveSearchButton = ({ disabled, onBtnClick }: SaveSearchButtonProps) => {
  const { t } = useTranslation();

  if (disabled) {
    return null;
  }

  return (
    <div>
      <Button size="small" onClick={onBtnClick} variant="secondary" color="first">
        <PlusIcon /> {t('filter_bar.save_search')}
      </Button>
    </div>
  );
};
