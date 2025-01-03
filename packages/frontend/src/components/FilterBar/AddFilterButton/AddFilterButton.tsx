import { ChevronDownIcon, PlusIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { DropdownList } from '../../DropdownMenu';
import type { Filter, FilterSetting, FilterValueType } from '../FilterBar.tsx';

import { Fragment } from 'react';
import { DropdownMobileHeader } from '../../DropdownMenu';
import { HorizontalLine } from '../../HorizontalLine';
import { MenuItem } from '../../MenuBar';
import { ProfileButton } from '../../ProfileButton';
import styles from './addFilterButton.module.css';

type AddFilterButtonProps = {
  settings: FilterSetting[];
  selectedFilters: Filter[];
  onListItemClick: (id: string, value: FilterValueType) => void;
  onAddBtnClick: () => void;
  onClose: () => void;
  isMenuOpen: boolean;
  disabled?: boolean;
  className?: string;
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
}: AddFilterButtonProps) => {
  const { t } = useTranslation();
  return (
    <div className={cx({ [styles.filterOpen]: isMenuOpen })}>
      <ProfileButton
        size="xs"
        onClick={onAddBtnClick}
        className={className}
        disabled={disabled}
        variant="secondary"
        color="neutral"
      >
        <PlusIcon fontSize="1.25rem" /> {t('filter_bar.add_filter')}
      </ProfileButton>
      <DropdownList isExpanded={isMenuOpen}>
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
            <Fragment key={setting.id}>
              <MenuItem
                onClick={() => {
                  onListItemClick(setting.id, undefined);
                }}
                leftContent={<span className={styles.addFilterItemLabel}>{setting.label}</span>}
                isActive={filterActive}
              />
              {setting.horizontalRule && <HorizontalLine />}
            </Fragment>
          );
        })}
      </DropdownList>
    </div>
  );
};
