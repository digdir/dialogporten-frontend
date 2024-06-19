import { ArrowsUpDownIcon, CheckmarkIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { type ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Backdrop } from '../Backdrop';
import { DropdownList, DropdownListItem, DropdownMobileHeader } from '../DropdownMenu';
import { ProfileButton } from '../ProfileButton';
import styles from './sortOrderDropdown.module.css';

export type SortingOrder = 'created_desc' | 'created_asc';

export type SortOrderDropdownRef = {
  openSortOrder: () => void;
};

interface SortOrderDropdownOption {
  label: string;
  id: SortingOrder;
}
interface SortOrderDropdownProps {
  onSelect: (selectedSortOrder: SortingOrder) => void;
  selectedSortOrder: SortingOrder;
  options: SortOrderDropdownOption[];
  btnClassName?: string;
}
export const SortOrderDropdown = forwardRef(
  (
    { onSelect, selectedSortOrder, options, btnClassName }: SortOrderDropdownProps,
    ref: ForwardedRef<SortOrderDropdownRef>,
  ): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { t } = useTranslation();
    const selectedOptionLabel = options.find((option) => option.id === selectedSortOrder)?.label;

    useImperativeHandle(ref, () => ({
      openSortOrder() {
        setIsOpen(true);
      },
    }));

    return (
      <div className={cx({ [styles.isOpen]: isOpen })}>
        <ProfileButton
          onClick={() => setIsOpen(!isOpen)}
          className={cx(styles.openBtn, btnClassName)}
          variant="secondary"
          size="small"
        >
          <ArrowsUpDownIcon fontSize="1.5rem" />
          {selectedOptionLabel}
        </ProfileButton>
        {isOpen && (
          <DropdownList className={styles.positionedRight}>
            <DropdownMobileHeader
              onClickButton={() => {
                setIsOpen(false);
              }}
              buttonText={t('sort_order.choose.label')}
              buttonIcon={<ChevronDownIcon fontSize="1.5rem" />}
            />
            {options.map((option) => (
              <DropdownListItem
                key={option.id}
                onClick={() => {
                  setIsOpen(false);
                  onSelect(option.id);
                }}
                leftContent={
                  <div className={styles.content}>
                    <span className={styles.checkMarkHolder}>
                      {option.id === selectedSortOrder && <CheckmarkIcon />}
                    </span>
                    <span className={styles.filterListLabel}>{option.label}</span>
                  </div>
                }
                isActive={option.id === selectedSortOrder}
              />
            ))}
          </DropdownList>
        )}
        <Backdrop show={isOpen} onClick={() => setIsOpen(false)} />
      </div>
    );
  },
);
