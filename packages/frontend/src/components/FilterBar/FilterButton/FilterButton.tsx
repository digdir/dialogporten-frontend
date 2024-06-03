import { Button, Checkbox } from '@digdir/designsystemet-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { Filter, FilterSetting, FilterValueType } from '../FilterBar';
import { FilterList, FilterListItem } from '../FilterList';

import cx from 'classnames';
import { useState } from 'react';
import styles from './filterButton.module.css';

export interface BaseFilterButtonProps {
  filterFieldData: FilterSetting;
  onListItemClick: (id: string, value: FilterValueType) => void;
  isOpen: boolean;
  onBtnClick: () => void;
  onRemove: (fieldName: string) => void;
  selectedFilters: Filter[];
}

export const FilterButton = ({
  filterFieldData,
  onListItemClick,
  onBtnClick,
  isOpen,
  onRemove,
  selectedFilters,
}: BaseFilterButtonProps) => {
  const [hoveringDeleteBtn, setHoveringDeleteBtn] = useState(false);
  const { id, unSelectedLabel, options } = filterFieldData;
  const valueLabels = selectedFilters.filter(
    (filter) => filter.id === filterFieldData.id && typeof filter.value !== 'undefined',
  );
  // TODO: i18n
  const valueLabel =
    valueLabels.length === 0
      ? unSelectedLabel
      : valueLabels.length === 1
        ? valueLabels[0].value
        : `${valueLabels.length} valgt`;

  return (
    <div className={styles.filterButton}>
      <div className={styles.buttons}>
        <Button onClick={onBtnClick} className={cx({ [styles.xed]: hoveringDeleteBtn })} size="small">
          {valueLabel}
        </Button>
        <Button
          size="small"
          onClick={() => {
            onRemove(id);
          }}
          onMouseEnter={() => {
            if (!hoveringDeleteBtn) {
              setHoveringDeleteBtn(true);
            }
          }}
          onMouseLeave={() => {
            if (hoveringDeleteBtn) {
              setHoveringDeleteBtn(false);
            }
          }}
        >
          <TrashIcon />
        </Button>
      </div>
      {isOpen ? (
        <FilterList>
          {options.map((option) => {
            const isMultiSelectable = filterFieldData.operation === 'includes';
            const listItemOnClick = isMultiSelectable ? undefined : () => onListItemClick(id, option.value);
            const isChecked = !!selectedFilters.find((filter) => filter.id === id && filter.value === option.value);
            return (
              <FilterListItem key={option.displayLabel} onClick={listItemOnClick || (() => {})}>
                <div className={styles.filterListContent}>
                  {isMultiSelectable && (
                    <Checkbox
                      onChange={() => onListItemClick(id, option.value)}
                      size="small"
                      value={option.displayLabel}
                      checked={isChecked}
                    />
                  )}
                  <span className={styles.filterListLabel}>{option.displayLabel}</span>
                  <span className={styles.filterListCount}>{option.count}</span>
                </div>
              </FilterListItem>
            );
          })}
        </FilterList>
      ) : null}
    </div>
  );
};
