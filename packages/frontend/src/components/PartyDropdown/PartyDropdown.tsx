import { ChevronUpDownIcon } from '@navikt/aksel-icons';
import { type Ref, forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParties } from '../../api/useParties.ts';
import { Backdrop } from '../Backdrop';
import { DropdownList, DropdownMobileHeader } from '../DropdownMenu';
import { ProfileButton } from '../ProfileButton';
import type { SideBarView } from '../Sidebar/Sidebar.tsx';
import { PartyList } from './PartyList.tsx';

interface PartyDropdownRef {
  openPartyDropdown: () => void;
}

interface PartyDropdownProps {
  counterContext?: SideBarView;
}

export const PartyDropdown = forwardRef((_: PartyDropdownProps, ref: Ref<PartyDropdownRef>) => {
  const { counterContext } = _;
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const { selectedParties } = useParties();

  useImperativeHandle(ref, () => ({
    openPartyDropdown: () => {
      setIsMenuOpen(false);
    },
  }));

  return (
    <div>
      <ProfileButton size="xs" onClick={() => setIsMenuOpen(!isMenuOpen)} color="neutral">
        {selectedParties?.[0]?.name ?? t('partyDropdown.selectParty')}
        <ChevronUpDownIcon fontSize="1.25rem" />
      </ProfileButton>
      <DropdownList variant="long" isExpanded={isMenuOpen}>
        <DropdownMobileHeader
          onClickButton={() => setIsMenuOpen(false)}
          buttonText={t('word.back')}
          buttonIcon={null}
        />
        <PartyList onOpenMenu={setIsMenuOpen} counterContext={counterContext} />
      </DropdownList>

      <Backdrop show={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
    </div>
  );
});
