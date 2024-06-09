import { Button, Checkbox, Textfield } from '@digdir/designsystemet-react';
import { ChevronRightIcon, TrashIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CustomFilterValueType,
  Filter,
  FilterBarFieldOption,
  FilterSetting,
  FilterValueType,
  SubLevelState,
} from '../FilterBar';
import { FilterList, FilterListItem } from '../FilterList';
import { isCombinedDateAndInterval } from '../dateInfo.ts';
import styles from './filterButton.module.css';

export interface BaseFilterButtonProps {
  filterFieldData: FilterSetting;
  onListItemClick: (id: string, value: FilterValueType, overrideValue?: boolean) => void;
  isOpen: boolean;
  onBtnClick: () => void;
  onRemove: (fieldName: string) => void;
  selectedFilters: Filter[];
  currentSubMenuLevel?: SubLevelState;
  onSubMenuLevelClick: (state: SubLevelState) => void;
}

const FilterButtonSection = ({
  date,
  onListItemClick,
  id,
}: {
  date: string;
  onListItemClick: (id: string, value: FilterValueType, overrideValue?: boolean) => void;
  id: string;
}) => {
  const { t } = useTranslation();
  const [start, end] = date.split('/'!);
  const minDate = format(new Date(start), 'yyyy-MM-dd');
  const maxDate = format(new Date(end), 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  return (
    <section className={styles.filterDateContent}>
      <Textfield
        key="fromDate"
        label={t('filter_bar.from_date_label')}
        size="sm"
        type="date"
        value={startDate || minDate}
        min={minDate}
        max={maxDate}
        onChange={(e) => {
          setStartDate(format(new Date(e.target.value), 'yyyy-MM-dd'));
        }}
      />
      <Textfield
        key="toDate"
        label={t('filter_bar.to_date_label')}
        size="sm"
        type="date"
        value={endDate || maxDate}
        min={minDate}
        max={maxDate}
        onChange={(e) => {
          setEndDate(format(new Date(e.target.value), 'yyyy-MM-dd'));
        }}
      />
      <Button
        onClick={() => {
          onListItemClick(id, `${startDate || minDate}/${endDate || maxDate}`, true);
        }}
        variant="secondary"
      >
        {t('filter_bar.choose_date')}
      </Button>
    </section>
  );
};
export const FilterButton = ({
  filterFieldData,
  onListItemClick,
  onBtnClick,
  isOpen,
  onRemove,
  selectedFilters,
  currentSubMenuLevel,
  onSubMenuLevelClick,
}: BaseFilterButtonProps) => {
  const { t } = useTranslation();
  const [hoveringDeleteBtn, setHoveringDeleteBtn] = useState(false);
  const { id, unSelectedLabel, options } = filterFieldData;

  const valueLabels = selectedFilters.filter((filter) => filter.id === id && typeof filter.value !== 'undefined');
  const valueLabel = (
    valueLabels.length === 0
      ? unSelectedLabel
      : valueLabels.length === 1
        ? valueLabels[0].value
        : t('filter_bar.items_chosen', { count: valueLabels.length })
  ) as string;

  const dateInfo = isCombinedDateAndInterval(valueLabel);
  const optionsValue = options.findIndex((option) => option.value === currentSubMenuLevel?.parentOptionValue);
  const chosenOptions = optionsValue > -1 ? options[optionsValue].options! : options;
  const handleOnClick = (shouldNotDismiss: boolean, option: FilterBarFieldOption) => {
    if (option.options?.length) {
      onSubMenuLevelClick({
        id,
        level: (currentSubMenuLevel?.level ?? 0) + 1,
        parentOptionValue: option.value,
      });
    } else {
      if (!shouldNotDismiss) {
        onListItemClick(id, option.value);
      }
    }
  };

  return (
    <div className={styles.filterButton}>
      <div className={styles.buttons}>
        <Button onClick={onBtnClick} className={cx({ [styles.xed]: hoveringDeleteBtn })} size="small">
          {dateInfo.isDate ? dateInfo.label : valueLabel}
        </Button>
        <Button
          size="small"
          onClick={() => onRemove(id)}
          onMouseEnter={() => setHoveringDeleteBtn(true)}
          onMouseLeave={() => setHoveringDeleteBtn(false)}
        >
          <TrashIcon />
        </Button>
      </div>
      {isOpen && (
        <FilterList>
          {chosenOptions.map((option) => {
            const isMultiSelectable = filterFieldData.operation === 'includes';
            const isChecked = selectedFilters.some((filter) => filter.id === id && filter.value === option.value);
            const shouldNotDismiss = isMultiSelectable || option.value === CustomFilterValueType['$startTime/$endTime'];

            if (option.value === CustomFilterValueType['$startTime/$endTime']) {
              return (
                <FilterButtonSection
                  key={id}
                  date={currentSubMenuLevel?.parentOptionValue as string}
                  onListItemClick={onListItemClick}
                  id={id}
                />
              );
            }

            return (
              <FilterListItem key={option.displayLabel} onClick={() => handleOnClick(shouldNotDismiss, option)}>
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
                  {option.options?.length ? (
                    <ChevronRightIcon />
                  ) : (
                    <span className={styles.filterListCount}>{option.count}</span>
                  )}
                </div>
              </FilterListItem>
            );
          })}
        </FilterList>
      )}
    </div>
  );
};
