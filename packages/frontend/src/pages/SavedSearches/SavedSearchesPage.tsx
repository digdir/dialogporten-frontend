import { BookmarksSection } from '@altinn/altinn-components';
import { useSnackbar } from '@altinn/altinn-components';
import type { EditableBookmarkProps } from '@altinn/altinn-components/dist/types/lib/components';
import { useQueryClient } from '@tanstack/react-query';
import { type ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { deleteSavedSearch, updateSavedSearch } from '../../api/queries.ts';
import { useParties } from '../../api/useParties.ts';
import { PartyDropdown } from '../../components';
import type { Filter } from '../../components';
import { QUERY_KEYS } from '../../constants/queryKeys.ts';
import { useFormatDistance } from '../../i18n/useDateFnsLocale.tsx';
import styles from './savedSearchesPage.module.css';
import { autoFormatRelativeTime, getMostRecentSearchDate } from './searchUtils.ts';
import { useSavedSearches } from './useSavedSearches.ts';

const randomString = () => {
  return Math.random()
    .toString(36)
    .slice(2, 2 + Math.floor(Math.random() * 11));
};

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
  const { openSnackbar } = useSnackbar();

  if (isLoadingSavedSearches) {
    const skeletonItems = 3;
    const items = Array.from({ length: skeletonItems }, (_, i) => ({
      id: i.toString(),
      title: t('savedSearches.loading_saved_searches') + randomString(),
      expandIconAltText: t('savedSearches.expand_icon_alt_text'),
    }));
    return (
      <div className={styles.savedSearchesWrapper}>
        <BookmarksSection title={t('savedSearches.loading_saved_searches')} items={items} loading />
      </div>
    );
  }

  if (!savedSearches?.length) {
    return (
      <div className={styles.savedSearchesWrapper}>
        <BookmarksSection
          title={t('savedSearches.no_saved_searches')}
          items={[]}
          description={t('savedSearches.noSearchesFound')}
        />
      </div>
    );
  }

  const items = (savedSearches ?? []).map((savedSearch) => {
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

    const itemObject: EditableBookmarkProps = {
      expandIconAltText: t('savedSearches.expand_icon_alt_text'),
      id: savedSearch.id.toString(),
      params: [],
      title: '',
      as: (props) => <Link {...props} to={`${fromView}?${queryParams.toString()}`} />,
      saveButton: {
        label: t('savedSearches.save_search'),
        onClick: () => {
          if (savedSearch?.id) {
            updateSavedSearch(savedSearch.id, savedSearchInputValue ?? '')
              .then(() => {
                openSnackbar({
                  message: t('savedSearches.update_success'),
                  color: 'success',
                });
                void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_SEARCHES] });
                setExpandedId('');
              })
              .catch(() => {
                openSnackbar({
                  message: t('savedSearches.update_failed'),
                  color: 'alert',
                });
              });
          }
        },
      },
      removeButton: {
        label: t('savedSearches.delete_search'),
        onClick: () => {
          deleteSavedSearch(savedSearch.id)
            .then(() => {
              openSnackbar({
                message: t('savedSearches.deleted_success'),
                color: 'success',
              });
              void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_SEARCHES] });
              setExpandedId('');
            })
            .catch(() => {
              openSnackbar({
                message: t('savedSearches.delete_failed'),
                color: 'alert',
              });
            });
        },
      },
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
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

    return itemObject;
  });

  const handleOnToggle = (itemId: string) => {
    const nextExpandedId = itemId === expandedId ? '' : itemId;
    if (nextExpandedId) {
      setSavedSearchInputValue(items?.find((item) => item.id === nextExpandedId)?.title ?? '');
    }
    setExpandedId(nextExpandedId);
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
          title={t('savedSearches.title', { count: savedSearches?.length })}
          items={items || []}
          description={`${t('savedSearches.lastUpdated')}${autoFormatRelativeTime(lastUpdated, formatDistance)}`}
          expandedId={expandedId}
          onToggle={handleOnToggle}
          titleField={{
            label: t('savedSearches.bookmark.item_input_label'),
            placeholder: t('savedSearches.bookmark.item_input_placeholder'),
            helperText: t('savedSearches.bookmark.item_input_helper'),
          }}
          untitled={t('savedSearches.bookmark.untitled')}
          loading={isLoadingSavedSearches}
        />
      </div>
    </div>
  );
};
