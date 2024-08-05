import { ChevronDownIcon } from '@navikt/aksel-icons';
import { type Ref, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { DropdownList, DropdownListItem, DropdownMobileHeader } from '../DropdownMenu';
import { ProfileButton } from '../ProfileButton';

import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Backdrop } from '../Backdrop';
import styles from './partyDropdown.module.css';

interface PartyDropdownRef {
  openPartyDropdown: () => void;
}
export const PartyDropdown = forwardRef((_: unknown, ref: Ref<PartyDropdownRef>) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const { parties, setSelectedPartyIds, selectedParties } = useParties();
  const { dialogs } = useDialogs(parties);
  const queryClient = useQueryClient();

  useImperativeHandle(ref, () => ({
    openPartyDropdown: () => {
      setIsMenuOpen(false);
    },
  }));

  /*
      TODO: Add subparties to the dropdown
   */
  // biome-ignore lint: lint/correctness/useExhaustiveDependencies
  const options = useMemo(() => {
    const topLevelParties = parties.map((party) => {
      const subPartyIds = party.subParties?.map((subParty) => subParty.party) ?? [];
      return {
        initial: party.name[0].toUpperCase(),
        label: party.name,
        isCompany: party.partyType === 'Organization',
        value: party.party,
        onSelectValues: [party.party],
        count: dialogs.filter((dialog) => [...subPartyIds, party.party].includes(dialog.party)).length,
      };
    });
    const allYourParties = {
      initial: '...',
      isCompany: parties.map((party) => party.partyType === 'Company').length > 1,
      label: t('partydropdown.all_parties'),
      value: 'all',
      onSelectValues: parties.map((party) => party.party),
      count: dialogs.length,
    };

    return [...topLevelParties, allYourParties];
  }, [parties, dialogs]);

  return (
    <>
      <ProfileButton size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} color="neutral">
        {selectedParties.length === 1 ? selectedParties[0].name : t('partydropdown.all_parties')}
        <ChevronDownIcon fontSize="1.5rem" />
      </ProfileButton>
      {isMenuOpen && (
        <DropdownList variant="long">
          <DropdownMobileHeader
            onClickButton={() => setIsMenuOpen(false)}
            buttonText={t('word.back')}
            buttonIcon={null}
          />
          {options.map((option) => (
            <DropdownListItem
              key={option.value}
              leftContent={
                <div className={styles.partyListContent}>
                  <div className={cx(styles.initial, option.isCompany ? styles.companyInitial : styles.personInitial)}>
                    <span>{option.initial}</span>
                  </div>
                  <span className={styles.partyListLabel}>{option.label}</span>
                </div>
              }
              rightContent={<span className={styles.partyCount}>{option.count}</span>}
              onClick={() => {
                setSelectedPartyIds(option.onSelectValues);
                void queryClient.invalidateQueries({ queryKey: ['dialogs'] });
                setIsMenuOpen(false);
              }}
            />
          ))}
        </DropdownList>
      )}
      <Backdrop show={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
    </>
  );
});
