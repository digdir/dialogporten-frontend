import { Search } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import type { PartyFieldsFragment } from 'bff-types-generated';
import cx from 'classnames';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Hr } from '.';
import { useDialogs } from '../../api/useDialogs';
import { useParties } from '../../api/useParties';
import { Avatar } from '../Avatar';
import { MenuLogoutButton, toTitleCase } from './NavigationDropdownMenu';
import type { DropdownSubMenuProps } from './NavigationDropdownSubMenu';
import styles from './navigationMenu.module.css';

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
        <li className={styles.menuItem}>
          <div
            role="button"
            tabIndex={0}
            className={styles.menuColumn}
            onClick={onBack}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onBack();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onBack();
              }
            }}
          >
            <ArrowLeftIcon className={styles.backButtonIcon} />
            <span className={styles.subMenuTitle}>{t('word.main_menu')}</span>
          </div>
        </li>
        <Hr />
        <li className={cx(styles.menuItem, styles.searchInput)}>
          <Search
            autoComplete="off"
            size="small"
            aria-label={t('header.searchPlaceholder')}
            placeholder={t('header.searchPlaceholder')}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            value={searchValue}
            onClear={() => setSearchValue('')}
          />
        </li>
        {filteredParties.map((party) => {
          const companyName = party.partyType === 'Organization' ? toTitleCase(party.name || '') : '';
          const count = inboxItems.filter((d) => d.receiver.label === party.name).length;
          return (
            <li
              key={party.party}
              className={cx(styles.menuItem, styles.partiesItem, {
                [styles.currentParty]: party.party === selectedParties[0].party,
              })}
              onClick={() => handleSelectParty([party])}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelectParty([party]);
                }
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelectParty([party]);
                }
              }}
            >
              <div className={styles.sidebarMenuItem} title={loggedInPersonName}>
                <div className={styles.menuColumn}>
                  <Avatar name={loggedInPersonName} companyName={companyName} darkCircle />
                  <div className={styles.primaryName}>{companyName || loggedInPersonName}</div>
                </div>
                <div className={styles.counterAndIcon}>
                  {!!count && <span className={styles.menuItemCounter}>{count}</span>}
                </div>
              </div>
            </li>
          );
        })}
        <Hr />
        <MenuLogoutButton />
      </ul>
    </div>
  );
};
