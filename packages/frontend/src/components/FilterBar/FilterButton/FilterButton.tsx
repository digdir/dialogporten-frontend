import { Checkbox, Textfield } from '@digdir/designsystemet-react';
import { CheckmarkIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormat } from '../../../i18n/useDateFnsLocale.tsx';
import { DropdownList, DropdownListItem } from '../../DropdownMenu';
import { DropdownMobileHeader } from '../../DropdownMenu';
import { ProfileButton } from '../../ProfileButton';
import {
  CustomFilterValueType,
  type Filter,
  type FilterBarFieldOption,
  type FilterSetting,
  type FilterValueType,
  type SubLevelState,
} from '../FilterBar';
import { isCombinedDateAndInterval } from '../dateInfo.ts';
import styles from './filterButton.module.css';
import { ShowFilterResultsButton } from '../ShowFilterResultsButton.tsx';

export interface BaseFilterButtonProps {
  filterFieldData: FilterSetting;
  onListItemClick: (id: string, value: FilterValueType, overrideValue?: boolean) => void;
  isOpen: boolean;
  onBtnClick: () => void;
  onRemove: (fieldName: string) => void;
  selectedFilters: Filter[];
  onSubMenuLevelClick: (state: SubLevelState) => void;
  onBackBtnClick: () => void;
  currentSubMenuLevel?: SubLevelState;
  nResults?: number;
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
  const format = useFormat();

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
      <ProfileButton
        onClick={() => {
          onListItemClick(id, `${startDate || minDate}/${endDate || maxDate}`, true);
        }}
        variant="secondary"
      >
        {t('filter_bar.choose_date')}
      </ProfileButton>
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
  onBackBtnClick,
  nResults,
}: BaseFilterButtonProps) => {
  const { t } = useTranslation();
  const [hoveringDeleteBtn, setHoveringDeleteBtn] = useState(false);
  const { id, unSelectedLabel, options, mobileNavLabel } = filterFieldData;
  const format = useFormat();

  const filtersForButton = selectedFilters.filter((filter) => filter.id === id && filter.value !== undefined);

  const valueLabels = filtersForButton.map(
    (filter) => options.find((option) => option.value === filter.value)?.displayLabel ?? (filter.value as string),
  );

  const displayLabel = (() => {
    if (valueLabels.length === 0) return unSelectedLabel;
    if (valueLabels.length === 1) return valueLabels[0];
    return t('filter_bar.items_chosen', { count: valueLabels.length });
  })();

  const dateInfo = isCombinedDateAndInterval(
    filtersForButton.length === 1 ? (filtersForButton[0].value as string) : displayLabel,
    format,
  );

  const chosenOptions =
    options.find((option) => option.value === currentSubMenuLevel?.parentOptionValue)?.options || options;
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
        <ProfileButton onClick={onBtnClick} className={cx({ [styles.xed]: hoveringDeleteBtn })} size="small">
          {dateInfo.isDate ? dateInfo.label : displayLabel}
        </ProfileButton>
        <ProfileButton
          size="small"
          className={styles.button}
          onClick={() => onRemove(id)}
          onMouseEnter={() => setHoveringDeleteBtn(true)}
          onMouseLeave={() => setHoveringDeleteBtn(false)}
        >
          <XMarkIcon />
        </ProfileButton>
      </div>
      {isOpen && (
        <DropdownList>
          <DropdownMobileHeader
            buttonIcon={<ChevronLeftIcon fontSize="1.5rem" />}
            onClickButton={onBackBtnClick}
            buttonText={mobileNavLabel}
          />
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
              <DropdownListItem
                key={option.displayLabel}
                onClick={() => handleOnClick(shouldNotDismiss, option)}
                hasHorizontalRule={option.horizontalRule}
                leftContent={
                  <div className={styles.filterListContent}>
                    {isMultiSelectable ? (
                      <Checkbox
                        onChange={() => onListItemClick(id, option.value)}
                        size="small"
                        value={option.displayLabel}
                        checked={isChecked}
                      >
                        <span className={styles.filterListLabel}>{option.displayLabel}</span>
                      </Checkbox>
                    ) : (
                      <>
                        <span className={styles.checkMarkHolder}>{isChecked && <CheckmarkIcon />}</span>
                        <span className={styles.filterListLabel}>{option.displayLabel}</span>
                      </>
                    )}
                  </div>
                }
                rightContent={
                  option.options?.length ? (
                    <ChevronRightIcon fontSize="1.5rem" />
                  ) : (
                    <span className={styles.filterListCount}>{option.count}</span>
                  )
                }
              />
            );
          })}
          <ShowFilterResultsButton nResults={nResults} onClick={onBtnClick} />
        </DropdownList>
      )}
    </div>
  );
};
