import { ChevronUpDownIcon } from '@navikt/aksel-icons';
import { type Ref, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { DropdownList, DropdownListItem, DropdownMobileHeader } from '../DropdownMenu';
import { ProfileButton } from '../ProfileButton';

import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Avatar } from '../Avatar';
import { Backdrop } from '../Backdrop';
import { mergeParties } from './mergeParties.ts';
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

  // biome-ignore lint: lint/correctness/useExhaustiveDependencies
  const options = useMemo(() => {
    return parties.map((party) => mergeParties(party, dialogs));
  }, [parties, dialogs]);

  return (
    <div>
      <ProfileButton size="xs" onClick={() => setIsMenuOpen(!isMenuOpen)} color="neutral">
        {selectedParties[0]?.name ?? t('partyDropdown.selectParty')}
        <ChevronUpDownIcon fontSize="1.25rem" />
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
                  <Avatar name={option.label} companyName={option.isCompany ? option.label : ''} size="small" />
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
    </div>
  );
});
