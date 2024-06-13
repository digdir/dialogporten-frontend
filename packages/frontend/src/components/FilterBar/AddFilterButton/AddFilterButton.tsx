import { Button } from '@digdir/designsystemet-react';
import { ChevronRightIcon, PlusIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { Filter, FilterSetting, FilterValueType } from '../FilterBar.tsx';
import { FilterList, FilterListItem } from '../FilterList';

import styles from './addFilterButton.module.css';

type AddFilterButtonProps = {
  settings: FilterSetting[];
  selectedFilters: Filter[];
  onListItemClick: (id: string, value: FilterValueType) => void;
  onAddBtnClick: () => void;
  isMenuOpen: boolean;
  disabled?: boolean;
};
export const AddFilterButton = ({
  settings,
  onListItemClick,
  disabled,
  selectedFilters,
  onAddBtnClick,
  isMenuOpen,
}: AddFilterButtonProps) => {
  const { t } = useTranslation();
  return (
    <div>
      <Button
        size="small"
        onClick={onAddBtnClick}
        disabled={disabled}
        variant="secondary"
        color="first"
        className={styles.addFilterButton}
      >
        <PlusIcon /> {t('filter_bar.add_filter')}
      </Button>
      {isMenuOpen && (
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
                leftContent={<span className={styles.addFilterItemLabel}>{setting.label}</span>}
                rightContent={<ChevronRightIcon fontSize="1.5rem" />}
              />
            );
          })}
        </FilterList>
      )}
    </div>
  );
};
