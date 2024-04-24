import { Button } from '@digdir/designsystemet-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { FilterBarField, FilterBarFieldOption } from '../FilterBar.tsx';
import { FilterList, FilterListItem } from '../FilterList';

import cx from 'classnames';
import { useState } from 'react';
import styles from './filterButton.module.css';

export interface BaseFilterButtonProps {
  filterOption: FilterBarField;
  onListItemClick: (id: string, option: FilterBarFieldOption) => void;
  isOpen: boolean;
  displayLabel?: string;
  onBtnClick: () => void;
  onRemove: (fieldName: string) => void;
}

export const FilterButton = ({
  filterOption,
  onListItemClick,
  onBtnClick,
  isOpen,
  onRemove,
  displayLabel,
}: BaseFilterButtonProps) => {
  const [hoveringDeleteBtn, setHoveringDeleteBtn] = useState(false);
  const { id, unSelectedLabel, options } = filterOption;
  const chosenDisplayLabel = displayLabel || unSelectedLabel;

  return (
    <div className={styles.filterButton}>
      <div className={styles.buttons}>
        <Button onClick={onBtnClick} className={cx({ [styles.xed]: hoveringDeleteBtn })} size="small">
          {chosenDisplayLabel}
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
            return (
              <FilterListItem
                key={option.label}
                onClick={() => {
                  onListItemClick(id, option);
                }}
              >
                <div className={styles.filterListContent}>
                  <span className={styles.filterListLabel}>{option.label}</span>
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
