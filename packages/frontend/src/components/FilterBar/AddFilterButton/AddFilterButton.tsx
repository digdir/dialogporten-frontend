import { Button } from '@digdir/designsystemet-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { Filter, FilterBarField } from '../FilterBar.tsx';
import { FilterList, FilterListItem } from '../FilterList';

import styles from './addFilterButton.module.css';

type AddFilterButtonProps = {
  filterOptions: FilterBarField[];
  filters: Filter[];
  onListItemClick: (option: FilterBarField) => void;
  onBtnClick: () => void;
  isOpen: boolean;
  disabled?: boolean;
};
export const AddFilterButton = ({
  filterOptions,
  onListItemClick,
  disabled,
  filters,
  onBtnClick,
  isOpen,
}: AddFilterButtonProps) => {
  const { t } = useTranslation();
  return (
    <div>
      <Button size="small" onClick={onBtnClick} disabled={disabled} variant="secondary" color="first">
        <PlusIcon /> {t('filter_bar.add_filter')}
      </Button>
      {isOpen && (
        <FilterList>
          {filterOptions.map((option: FilterBarField) => {
            const isUsed = !!filters.find((filter) => filter.fieldName === option.id);
            return (
              <FilterListItem
                key={option.id}
                disabled={isUsed}
                onClick={() => {
                  onListItemClick(option);
                }}
              >
                <div className={styles.addFilterButtonContent}>
                  {option.leftIcon}
                  <span className={styles.addFilterItemLabel}>{option.label}</span>
                  <span className={styles.addFilterItemCount}>{option.options.length}</span>
                </div>
              </FilterListItem>
            );
          })}
        </FilterList>
      )}
    </div>
  );
};
