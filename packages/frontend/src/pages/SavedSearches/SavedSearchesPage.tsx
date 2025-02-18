import { BookmarksSection, Toolbar } from '@altinn/altinn-components';
import { useParties } from '../../api/useParties.ts';
import { type CountableItem, useAccounts } from '../../components/PageLayout/Accounts/useAccounts.tsx';
import { PageRoutes } from '../routes.ts';
import styles from './savedSearchesPage.module.css';
import { useSavedSearches } from './useSavedSearches.tsx';

export const SavedSearchesPage = () => {
  const { selectedPartyIds, parties, selectedParties, allOrganizationsSelected } = useParties();
  const { savedSearches, bookmarkSectionProps } = useSavedSearches(selectedPartyIds);

  const { accounts, selectedAccount, accountSearch, accountGroups, onSelectAccount } = useAccounts({
    parties,
    selectedParties,
    allOrganizationsSelected,
    countableItems: (savedSearches ?? []).map((s) => ({
      party: Array.isArray(s.data.urn) ? s.data.urn[0] : '',
    })) as CountableItem[],
    dialogCountInconclusive: false,
  });

  return (
    <>
      <section className={styles.filtersArea}>
        <div className={styles.gridContainer}>
          {selectedAccount ? (
            <Toolbar
              accountMenu={{
                accounts,
                accountSearch,
                accountGroups,
                currentAccount: selectedAccount,
                onSelectAccount: (account: string) => onSelectAccount(account, PageRoutes.savedSearches),
              }}
            />
          ) : null}
        </div>
      </section>
      <div className={styles.savedSearchesWrapper}>
        {bookmarkSectionProps && <BookmarksSection {...bookmarkSectionProps} />}
      </div>
    </>
  );
};
