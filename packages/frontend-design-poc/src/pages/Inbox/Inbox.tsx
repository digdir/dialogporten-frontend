import { ArrowForwardIcon, ClockDashedIcon, EnvelopeOpenIcon, PersonIcon, TrashIcon } from '@navikt/aksel-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { getDialogs } from '../../api/queries.ts';
import { ActionPanel, InboxItem, InboxItemTag, InboxItems, Participant } from '../../components';
import { type Filter, FilterBar } from '../../components/FilterBar';
import { FilterBarField } from '../../components/FilterBar/FilterBar.tsx';
import { InboxItemsHeader } from '../../components/InboxItem/InboxItemsHeader.tsx';
import { mapDialogDtoToInboxItem } from '../../mocks/dialogs.tsx';
import styles from './inbox.module.css';

export interface InboxItemInput {
  id: string;
  title: string;
  description: string;
  sender: Participant;
  receiver: Participant;
  tags: InboxItemTag[];
  linkTo: string;
  date: string;
  createdAt: string;
  status: string;
}

function countOccurrences(array: string[]): Record<string, number> {
  return array.reduce(
    (acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export const Inbox = () => {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const { data: dialogs } = useQuery('dialogs', getDialogs);
  const dialogData = useMemo(() => mapDialogDtoToInboxItem(dialogs || []), [dialogs]);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const selectedItemCount = Object.values(selectedItems).filter(Boolean).length;

  const filteredData = useMemo(() => {
    return dialogData.filter((item) =>
      activeFilters.every((filter) => {
        if (Array.isArray(filter.value)) {
          return filter.value.includes(String(item[filter.fieldName as keyof InboxItemInput]));
        }
        if (typeof filter.value === 'string') {
          if (filter.fieldName === 'sender') {
            const sender = item[filter.fieldName as keyof InboxItemInput] as Participant;
            return filter.value === sender.label;
          }
          return filter.value === item[filter.fieldName as keyof InboxItemInput];
        }
        return true;
      }),
    );
  }, [dialogData, activeFilters]);

  const filterBarFields: FilterBarField[] = useMemo(() => {
    return [
      {
        id: 'sender',
        label: 'Avsender',
        unSelectedLabel: 'Alle avsendere',
        leftIcon: <PersonIcon />,
        options: (() => {
          const senders = filteredData.map((p) => p.sender.label);
          const senderCounts = countOccurrences(senders);
          return Array.from(new Set(senders)).map((sender) => ({
            id: sender,
            label: sender,
            value: sender,
            count: senderCounts[sender],
            operation: 'equals',
          }));
        })(),
      },
    ];
  }, [filteredData]);

  const dataGroupedByYear = useMemo(() => {
    return filteredData.reduce(
      (acc: Record<string, InboxItemInput[]>, item) => {
        const year = String(new Date(item.date).getFullYear());
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(item);
        return acc;
      },
      {} as Record<string, InboxItemInput[]>,
    );
  }, [filteredData]);

  const handleCheckedChange = (checkboxValue: string, checked: boolean) => {
    setSelectedItems((prev: Record<string, boolean>) => ({
      ...prev,
      [checkboxValue]: checked,
    }));
  };

  return (
    <main>
      <div className={styles.filterBarWrapper}>
        <FilterBar fields={filterBarFields} onFilterChange={(filters) => setActiveFilters(filters)} />
      </div>
      {selectedItemCount > 0 && (
        <div className={styles.actionPanelWrapper}>
          <ActionPanel
            actionButtons={[
              {
                label: t('actionPanel.buttons.share'),
                icon: <ArrowForwardIcon />,
              },
              {
                label: t('actionPanel.buttons.mark_as_read'),
                icon: <EnvelopeOpenIcon />,
              },
              {
                label: t('actionPanel.buttons.archive'),
                icon: <ClockDashedIcon />,
              },
              {
                label: t('actionPanel.buttons.delete'),
                icon: <TrashIcon />,
              },
            ]}
            selectedItemCount={selectedItemCount}
            onUndoSelection={() => setSelectedItems({})}
          />
        </div>
      )}
      <section>
        {Object.entries(dataGroupedByYear)
          .reverse()
          .map(([year, items]) => {
            const hideSelectAll = items.every((item) => selectedItems[item.id]);
            return (
              <InboxItems key={year}>
                <InboxItemsHeader
                  hideSelectAll={hideSelectAll}
                  onSelectAll={() => {
                    const newItems = Object.fromEntries(items.map((item) => [item.id, true]));
                    setSelectedItems({
                      ...selectedItems,
                      ...newItems,
                    });
                  }}
                  title={year}
                />
                {items.map((item) => (
                  <InboxItem
                    key={item.id}
                    checkboxValue={item.id}
                    title={item.title}
                    toLabel={t('word.to')}
                    description={item.description}
                    sender={item.sender}
                    receiver={item.receiver}
                    isChecked={selectedItems[item.id]}
                    onCheckedChange={(checked) => handleCheckedChange(item.id, checked)}
                    tags={item.tags}
                    linkTo={item.linkTo}
                  />
                ))}
              </InboxItems>
            );
          })}
      </section>
    </main>
  );
};
