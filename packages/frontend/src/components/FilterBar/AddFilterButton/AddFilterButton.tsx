import { ChevronDownIcon, ChevronRightIcon, PlusIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { DropdownList, DropdownListItem } from '../../DropdownMenu';
import type { Filter, FilterSetting, FilterValueType } from '../FilterBar.tsx';

import { DropdownMobileHeader } from '../../DropdownMenu';
import { ProfileButton } from '../../ProfileButton';
import styles from './addFilterButton.module.css';
import { ShowFilterResultsButton } from '../ShowFilterResultsButton.tsx';

type AddFilterButtonProps = {
  settings: FilterSetting[];
  selectedFilters: Filter[];
  onListItemClick: (id: string, value: FilterValueType) => void;
  onAddBtnClick: () => void;
  onClose: () => void;
  isMenuOpen: boolean;
  disabled?: boolean;
  className?: string;
  nResults?: number;
};
export const AddFilterButton = ({
  settings,
  onListItemClick,
  disabled,
  selectedFilters,
  onAddBtnClick,
  isMenuOpen,
  onClose,
  className,
  nResults,
}: AddFilterButtonProps) => {
  const { t } = useTranslation();
  return (
    <div className={cx({ [styles.filterOpen]: isMenuOpen })}>
      <ProfileButton
        size="small"
        onClick={onAddBtnClick}
        className={className}
        disabled={disabled}
        variant="secondary"
        color="first"
      >
        <PlusIcon fontSize="1.5rem" /> {t('filter_bar.add_filter')}
      </ProfileButton>
      {isMenuOpen && (
        <DropdownList variant="long">
          <DropdownMobileHeader
            buttonIcon={<ChevronDownIcon fontSize="1.5rem" />}
            onClickButton={onClose}
            buttonText={t('filter_bar.add_filter')}
          />
          {settings.map((setting: FilterSetting) => {
            const filterActive = !!selectedFilters.find(
              (filter) => filter.id === setting.id && filter.value !== undefined,
            );
            return (
              <DropdownListItem
                key={setting.id}
                onClick={() => {
                  onListItemClick(setting.id, undefined);
                }}
                leftContent={<span className={styles.addFilterItemLabel}>{setting.label}</span>}
                rightContent={<ChevronRightIcon fontSize="1.5rem" />}
                hasHorizontalRule={setting.horizontalRule}
                isActive={filterActive}
              />
            );
          })}
          <ShowFilterResultsButton nResults={nResults} onClick={onClose} />
        </DropdownList>
      )}
    </div>
  );
};
