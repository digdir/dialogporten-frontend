import { ChevronDownIcon } from '@navikt/aksel-icons';
import { type Ref, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { DropdownList, DropdownListItem, DropdownMobileHeader } from '../DropdownMenu';
import { ProfileButton } from '../ProfileButton';

import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './partyDropdown.module.css';

interface PartyDropdownRef {
  openPartyDropdown: () => void;
}
export const PartyDropdown = forwardRef((_: unknown, ref: Ref<PartyDropdownRef>) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const { parties, setSelectedPartyIds, selectedParties } = useParties();
  const { dialogs } = useDialogs(parties);

  useImperativeHandle(ref, () => ({
    openPartyDropdown: () => {
      setIsMenuOpen(false);
    },
  }));

  /*
      TODO: Add subparties to the dropdown
   */
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
      isCompany: false,
      label: t('partydropdown.all_parties'),
      value: 'all',
      onSelectValues: parties.map((party) => party.party),
      count: dialogs.length,
    };

    return [...topLevelParties, allYourParties];
  }, [parties, dialogs]);

  return (
    <div>
      <ProfileButton size="small" onClick={() => setIsMenuOpen(!isMenuOpen)} color="first">
        {selectedParties.length > 0 ? selectedParties[0].name : `${parties.length} valgt`}
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
                setIsMenuOpen(false);
              }}
            />
          ))}
        </DropdownList>
      )}
    </div>
  );
});
