import { ArrowLeftIcon, CheckmarkIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormat } from '../../../i18n/useDateFnsLocale.tsx';
import { Badge } from '../../Badge';
import { DropdownList, DropdownListItem } from '../../DropdownMenu';
import { DropdownMobileHeader } from '../../DropdownMenu';
import { HorizontalLine } from '../../HorizontalLine';
import { ProfileButton } from '../../ProfileButton';
import { ProfileCheckbox } from '../../ProfileCheckbox';
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
}
interface FilterButtonSectionProps {
  date: string;
  onListItemClick: (id: string, value: FilterValueType, overrideValue?: boolean) => void;
  id: string;
  onBack: () => void;
}
export const FilterButtonSection = ({ date, onListItemClick, id, onBack }: FilterButtonSectionProps) => {
  const { t } = useTranslation();
  const format = useFormat();

  const [start, end] = date.split('/'!);
  const minDate = format(new Date(start), 'yyyy-MM-dd');
  const maxDate = format(new Date(end), 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  return (
    <section className={styles.filterDateContent}>
      <div
        role="button"
        tabIndex={0}
        className={styles.menuColumn}
        onClick={onBack}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onBack();
        }}
      >
        <ArrowLeftIcon className={styles.backButtonIcon} />
        <span className={styles.subMenuTitle}>{t('word.back')}</span>
      </div>
      <HorizontalLine />
      <label htmlFor="fromDate">{t('filter_bar.from_date_label')}</label>
      <div className={styles.dateInputWrapper}>
        <input
          id="fromDate"
          key="fromDate"
          type="date"
          value={startDate || minDate}
          min={minDate}
          max={maxDate}
          className={styles.dateInputField}
          onChange={(e) => {
            setStartDate(format(new Date(e.target.value), 'yyyy-MM-dd'));
          }}
        />
        <button type="button" onClick={() => setStartDate('')} className={styles.clearDateButton}>
          <XMarkIcon className={styles.clearDateIcon} />
        </button>
      </div>
      <label htmlFor="toDate">{t('filter_bar.to_date_label')}</label>
      <div className={styles.dateInputWrapper}>
        <input
          key="toDate"
          type="date"
          value={endDate || maxDate}
          min={minDate}
          className={styles.dateInputField}
          max={maxDate}
          onChange={(e) => {
            setEndDate(format(new Date(e.target.value), 'yyyy-MM-dd'));
          }}
        />
        <button type="button" onClick={() => setEndDate('')} className={styles.clearDateButton}>
          <XMarkIcon className={styles.clearDateIcon} />
        </button>
      </div>

      <ProfileButton
        onClick={() => {
          onListItemClick(id, `${startDate || minDate}/${endDate || maxDate}`, true);
        }}
        variant="secondary"
        size="xs"
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
        <ProfileButton
          onClick={onBtnClick}
          className={cx(styles.removeFilterButton, { [styles.xed]: hoveringDeleteBtn })}
          size="xs"
        >
          {dateInfo.isDate ? dateInfo.label : displayLabel}
        </ProfileButton>
        <ProfileButton
          size="xs"
          className={styles.xableButton}
          onClick={() => onRemove(id)}
          onMouseEnter={() => setHoveringDeleteBtn(true)}
          onMouseLeave={() => setHoveringDeleteBtn(false)}
        >
          <XMarkIcon fontSize="1.5rem" />
        </ProfileButton>
      </div>
      {isOpen && (
        <DropdownList variant="long">
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
                  onBack={onBackBtnClick}
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
                      <ProfileCheckbox
                        onChange={() => onListItemClick(id, option.value)}
                        size="sm"
                        value={option.displayLabel}
                        checked={isChecked}
                        className={styles.checkbox}
                      >
                        <span className={styles.filterListLabel}>{option.displayLabel}</span>
                      </ProfileCheckbox>
                    ) : (
                      <>
                        <span className={styles.checkMarkHolder}>{isChecked && <CheckmarkIcon />}</span>
                        <span className={styles.filterListLabel}>{option.displayLabel}</span>
                      </>
                    )}
                  </div>
                }
                rightContent={
                  option.options?.length ? <ChevronRightIcon fontSize="1.5rem" /> : <Badge label={option.count} />
                }
              />
            );
          })}
        </DropdownList>
      )}
    </div>
  );
};
