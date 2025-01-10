import { type BookmarksListItemProps, BookmarksSection } from '@altinn/altinn-components';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { deleteSavedSearch, updateSavedSearch } from '../../api/queries.ts';
import { useParties } from '../../api/useParties.ts';
import { PartyDropdown } from '../../components';
import type { Filter } from '../../components';
import { QUERY_KEYS } from '../../constants/queryKeys.ts';
import { useFormatDistance } from '../../i18n/useDateFnsLocale.tsx';
import { SavedSearchesSkeleton } from './SavedSearchesSkeleton';
import styles from './savedSearchesPage.module.css';
import { autoFormatRelativeTime, getMostRecentSearchDate } from './searchUtils.ts';
import { useSavedSearches } from './useSavedSearches.ts';

export const SavedSearchesPage = () => {
  const { t } = useTranslation();
  const { selectedPartyIds } = useParties();
  const { currentPartySavedSearches: savedSearches, isLoading: isLoadingSavedSearches } =
    useSavedSearches(selectedPartyIds);
  const formatDistance = useFormatDistance();
  const lastUpdated = getMostRecentSearchDate(savedSearches ?? []) as Date;
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string>('');

  const [savedSearchInputValue, setSavedSearchInputValue] = useState<string>('');

  if (isLoadingSavedSearches) {
    return <SavedSearchesSkeleton numberOfItems={3} />;
  }

  if (!savedSearches?.length) {
    return (
      <div>
        <section className={styles.filtersArea}>
          <div className={styles.gridContainer}>
            <div className={styles.filterSaveContainer}>
              <PartyDropdown counterContext="saved-searches" />
            </div>
          </div>
        </section>
        <section className={styles.savedSearchesWrapper}>
          <div className={styles.title}>{t('savedSearches.title', { count: 0 })}</div>
          <span>{t('savedSearches.noSearchesFound')}</span>
        </section>
      </div>
    );
  }

  const items = savedSearches.map((savedSearch) => {
    const { searchString, filters, fromView } = savedSearch.data;
    const urlParams = new URLSearchParams(window.location.search);
    const allParties = urlParams.get('allParties');
    const queryParams = new URLSearchParams(
      Object.entries({
        search: searchString,
        party: allParties ? null : urlParams.get('party'), // Exclude 'party' if 'allParties' exists
        allParties,
      }).reduce(
        (acc, [key, value]) => {
          if (value) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string>,
      ),
    );

    for (const filter of filters as Filter[]) {
      queryParams.append(filter.id, String(filter.value));
    }

    const itemObject: BookmarksListItemProps = {
      id: savedSearch.id.toString(),
      params: [],
      title: '',
      as: (props) => <Link {...props} to={`${fromView}?${queryParams.toString()}`} />,
      saveButton: {
        label: t('savedSearches.save_search'),
        onClick: () => {
          if (savedSearch?.id) {
            updateSavedSearch(savedSearch.id, savedSearchInputValue ?? '').then(() => {
              void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_SEARCHES] });
              setExpandedId('');
            });
          }
        },
      },
      removeButton: {
        label: t('savedSearches.delete_search'),
        onClick: () => {
          deleteSavedSearch(savedSearch.id).then(() => {
            void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_SEARCHES] });
            setExpandedId('');
          });
        },
      },
      onChange: (e) => {
        setSavedSearchInputValue(e.target.value);
      },
      inputValue: savedSearchInputValue,
    };

    if (savedSearch.name) {
      itemObject.title = savedSearch.name;
    }

    if (savedSearch.data?.searchString) {
      itemObject.params?.push({ type: 'search', label: savedSearch.data?.searchString });
    }

    if (savedSearch.data?.filters && savedSearch.data.filters.length > 0) {
      for (const filter of savedSearch.data.filters) {
        itemObject.params?.push({ type: 'filter', label: filter?.value ?? '' });
      }
    }

    return {
      ...itemObject,
    };
  });

  const handleOnToggle = (itemId: string) => {
    if (expandedId === itemId) {
      setExpandedId('');
      return;
    }
    setExpandedId(itemId);
  };

  return (
    <div>
      <section className={styles.filtersArea}>
        <div className={styles.gridContainer}>
          <div className={styles.filterSaveContainer}>
            <PartyDropdown counterContext="saved-searches" />
          </div>
        </div>
      </section>
      <div className={styles.savedSearchesWrapper}>
        <BookmarksSection
          title={t('savedSearches.title', { count: savedSearches.length })}
          items={items}
          description={`${t('savedSearches.lastUpdated')}${autoFormatRelativeTime(lastUpdated, formatDistance)}`}
          expandedId={expandedId}
          onToggle={handleOnToggle}
          titleField={{
            label: t('savedSearches.bookmark.item_input_label'),
            placeholder: t('savedSearches.bookmark.item_input_placeholder'),
            helperText: t('savedSearches.bookmark.item_input_helper'),
          }}
          untitled={t('savedSearches.bookmark.untitled')}
        />
      </div>
    </div>
  );
};
