import { Search } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import type { PartyFieldsFragment } from 'bff-types-generated';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { MenuItem } from '.';
import { useDialogs } from '../../api/useDialogs';
import { useParties } from '../../api/useParties';
import { Avatar } from '../Avatar';
import { HorizontalLine } from '../Sidebar';
import { MenuLogoutButton, toTitleCase } from './NavigationDropdownMenu';
import type { DropdownSubMenuProps } from './NavigationDropdownSubMenu';
import styles from './navigationDropdownMenu.module.css';

export const NavigationDropdownSubMenuProfile: React.FC<DropdownSubMenuProps> = ({ onClose, onBack }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const { parties, setSelectedParties, selectedParties } = useParties();
  const queryClient = useQueryClient();
  const { dialogsByView } = useDialogs(parties);
  if (!parties.length) {
    return null;
  }
  const { inbox: inboxItems } = dialogsByView;

  const loggedInPersonName = toTitleCase(parties.find((party) => party.partyType === 'Person')?.name || '' || '');

  const handleSelectParty = (parties: PartyFieldsFragment[]) => {
    setSelectedParties(parties);
    queryClient.invalidateQueries({ queryKey: ['dialogs'] });
    onClose?.();
  };
  const filteredParties = useMemo(() => {
    return parties.filter((party) => party.name.toLowerCase().includes(searchValue.toLowerCase()));
  }, [parties, searchValue]);

  return (
    <div className={styles.menuItems}>
      <ul className={styles.menuList}>
        <MenuItem
          leftContent={
            <div
              role="button"
              tabIndex={0}
              className={styles.menuColumn}
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
        <HorizontalLine fullWidth />
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
        {filteredParties.map((party) => {
          const companyName = party.partyType === 'Organization' ? toTitleCase(party.name || '') : '';
          const count = inboxItems.filter((d) => d.receiver.label === party.name).length;
          return (
            <MenuItem
              key={party.party}
              icon={<Avatar name={loggedInPersonName} companyName={companyName} />}
              displayText={companyName || loggedInPersonName}
              label={companyName || loggedInPersonName}
              count={count}
              isActive={party.party === selectedParties[0].party}
              onClick={() => handleSelectParty([party])}
              isWhiteBackground
              smallIcon
              smallText
            />
          );
        })}
        <HorizontalLine fullWidth />
        <MenuLogoutButton />
      </ul>
    </div>
  );
};
