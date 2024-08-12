import { Search } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { MenuItem } from '.';
import { useDialogs } from '../../api/useDialogs';
import { useParties } from '../../api/useParties';
import { Avatar } from '../Avatar';
import { HorizontalLine } from '../HorizontalLine';
import { mergeParties } from '../PartyDropdown/mergeParties.ts';
import { MenuLogoutButton } from './NavigationDropdownMenu';
import type { DropdownSubMenuProps } from './NavigationDropdownSubMenu';
import styles from './navigationDropdownMenu.module.css';

export const NavigationDropdownSubMenuProfile: React.FC<DropdownSubMenuProps> = ({ onClose, onBack }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const { parties, setSelectedPartyIds, selectedParties } = useParties();
  const queryClient = useQueryClient();
  const { dialogsByView } = useDialogs(parties);
  if (!parties.length) {
    return null;
  }
  const { inbox: inboxItems } = dialogsByView;
  const loggedInPersonName = parties.find((party) => party.partyType === 'Person')?.name ?? '';

  const handleSelectParty = (parties: string[]) => {
    setSelectedPartyIds(parties);
    void queryClient.invalidateQueries({ queryKey: ['dialogs'] });
    onClose?.();
  };

  const filteredPartyOptions = useMemo(() => {
    return parties
      .filter((party) => party.name.toLowerCase().includes(searchValue.toLowerCase()))
      .map((party) => mergeParties(party, inboxItems));
  }, [parties, inboxItems, searchValue]);

  return (
    <div className={styles.menuItems}>
      <ul className={styles.menuList}>
        <MenuItem
          leftContent={
            <div
              role="button"
              tabIndex={0}
              className={styles.linkContent}
              onClick={onBack}
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onBack();
              }}
            >
              <ArrowLeftIcon className={styles.backButtonIcon} />
              <span className={styles.subMenuTitle}>{t('word.main_menu')}</span>
            </div>
          }
          isWhiteBackground
        />
        <HorizontalLine />
        <MenuItem
          leftContent={
            <Search
              autoComplete="off"
              size="sm"
              aria-label={t('word.search')}
              placeholder={t('word.search')}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              value={searchValue}
              onClear={() => setSearchValue('')}
            />
          }
          fullWidth
        />
        {filteredPartyOptions.map((party) => {
          return (
            <MenuItem
              key={party.value}
              icon={<Avatar name={loggedInPersonName} companyName={party.label} />}
              displayText={party.label}
              label={party.value}
              count={party.count}
              isActive={party.value === selectedParties[0].party}
              onClick={() => handleSelectParty(party.onSelectValues)}
              isWhiteBackground
              smallIcon
              smallText
            />
          );
        })}
        <HorizontalLine />
        <MenuLogoutButton />
      </ul>
    </div>
  );
};
