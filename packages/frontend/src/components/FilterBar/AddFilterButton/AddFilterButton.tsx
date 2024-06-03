import { Button } from '@digdir/designsystemet-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { Filter, FilterSetting, FilterValueType } from '../FilterBar.tsx';
import { FilterList, FilterListItem } from '../FilterList';

import styles from './addFilterButton.module.css';

type AddFilterButtonProps = {
  settings: FilterSetting[];
  selectedFilters: Filter[];
  onListItemClick: (id: string, value: FilterValueType) => void;
  onAddBtnClick: () => void;
  isOpen: boolean;
  disabled?: boolean;
};
export const AddFilterButton = ({
  settings,
  onListItemClick,
  disabled,
  selectedFilters,
  onAddBtnClick,
  isOpen,
}: AddFilterButtonProps) => {
  const { t } = useTranslation();
  return (
    <div>
      <Button size="small" onClick={onAddBtnClick} disabled={disabled} variant="secondary" color="first">
        <PlusIcon /> {t('filter_bar.add_filter')}
      </Button>
      {isOpen && (
        <FilterList>
          {settings.map((setting: FilterSetting) => {
            const isUsed = !!selectedFilters.find((filter) => filter.id === setting.id);
            return (
              <FilterListItem
                key={setting.id}
                disabled={isUsed}
                onClick={() => {
                  onListItemClick(setting.id, undefined);
                }}
              >
                <div className={styles.addFilterButtonContent}>
                  {setting.leftIcon}
                  <span className={styles.addFilterItemLabel}>{setting.label}</span>
                  <span className={styles.addFilterItemCount}>{setting.options.length}</span>
                </div>
              </FilterListItem>
            );
          })}
        </FilterList>
      )}
    </div>
  );
};
