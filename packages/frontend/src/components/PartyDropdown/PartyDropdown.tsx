import { ChevronUpDownIcon } from '@navikt/aksel-icons';
import { type Ref, forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParties } from '../../api/useParties.ts';
import { Backdrop } from '../Backdrop';
import { DropdownList, DropdownMobileHeader } from '../DropdownMenu';
import { ProfileButton } from '../ProfileButton';
import type { SideBarView } from '../Sidebar';
import { PartyListContainer } from './PartyListContainer.tsx';

interface PartyDropdownRef {
  openPartyDropdown: () => void;
}

interface PartyDropdownProps {
  counterContext?: SideBarView;
}

export const PartyDropdown = forwardRef((props: PartyDropdownProps, ref: Ref<PartyDropdownRef>) => {
  const { counterContext } = props;
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const { selectedParties, allOrganizationsSelected, parties } = useParties();

  useImperativeHandle(ref, () => ({
    openPartyDropdown: () => {
      setIsMenuOpen(false);
    },
  }));

  return (
    <div>
      <ProfileButton size="xs" onClick={() => setIsMenuOpen(!isMenuOpen)} color="neutral" disabled={!parties.length}>
        {allOrganizationsSelected
          ? t('parties.labels.all_organizations')
          : (selectedParties?.[0]?.name ?? t('partyDropdown.selectParty'))}
        <ChevronUpDownIcon fontSize="1.25rem" />
      </ProfileButton>
      <DropdownList isExpanded={isMenuOpen}>
        <DropdownMobileHeader
          onClickButton={() => setIsMenuOpen(false)}
          buttonText={t('word.back')}
          buttonIcon={null}
        />
        <PartyListContainer onSelect={() => setIsMenuOpen(false)} counterContext={counterContext} />
      </DropdownList>
      <Backdrop show={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
    </div>
  );
});
