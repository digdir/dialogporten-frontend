import {
  ArrowForwardIcon,
  ClockDashedIcon,
  EnvelopeOpenIcon,
  PersonIcon,
  PersonSuitIcon,
  SealIcon,
  StarIcon,
  TrashIcon,
} from '@navikt/aksel-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionPanel, InboxItem, InboxItemTag, InboxItems, Participant } from '../../components';
import { InboxItemsHeader } from '../../components/InboxItem/InboxItemsHeader.tsx';
import styles from './inbox.module.css';

interface Dialog {
  checkboxValue: string;
  title: string;
  description: string;
  sender: Participant;
  receiver: Participant;
  tags: InboxItemTag[];
  linkTo: string;
  date: string;
}

export const Inbox = () => {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const selectedItemCount = Object.values(selectedItems).filter(Boolean).length;

  const data: Dialog[] = [
    {
      checkboxValue: 'test',
      title: 'Viktig melding',
      description: 'Du har mottatt en viktig melding!',
      sender: { label: 'Viktig bedrift', icon: <PersonSuitIcon /> },
      receiver: { label: 'Bruker Brukerson', icon: <PersonIcon /> },
      tags: [
        { label: 'hello', icon: <StarIcon /> },
        { label: 'hallaz', icon: <SealIcon /> },
      ],
      linkTo: '/inbox/1',
      date: '2023-08-15',
    },
    {
      checkboxValue: 'test2',
      title: 'Har du glemt oss?',
      description: 'Det tror jeg du har!',
      sender: { label: 'Viktig bedrift', icon: <PersonSuitIcon /> },
      receiver: { label: 'Bruker Brukerson', icon: <PersonIcon /> },
      tags: [
        { label: 'hello', icon: <StarIcon /> },
        { label: 'hallaz', icon: <SealIcon /> },
      ],
      linkTo: '/inbox/2',
      date: '2023-09-20',
    },
    {
      checkboxValue: 'test3',
      title: 'Årsrapport klar',
      description: 'Din årsrapport for 2023 er nå tilgjengelig.',
      sender: { label: 'Regnskapsfirmaet AS', icon: <PersonSuitIcon /> },
      receiver: { label: 'Bruker Brukerson', icon: <PersonIcon /> },
      tags: [
        { label: 'rapport', icon: <SealIcon /> },
        { label: 'viktig', icon: <StarIcon /> },
      ],
      linkTo: '/inbox/3',
      date: '2024-01-05',
    },
    {
      checkboxValue: 'test4',
      title: 'Oppdatering av vilkår',
      description: 'Vilkårene for bruk av vår tjeneste er oppdatert.',
      sender: { label: 'Tjeneste AS', icon: <PersonSuitIcon /> },
      receiver: { label: 'Bruker Brukerson', icon: <PersonIcon /> },
      tags: [
        { label: 'oppdatering', icon: <EnvelopeOpenIcon /> },
        { label: 'vilkår', icon: <SealIcon /> },
      ],
      linkTo: '/inbox/4',
      date: '2024-02-14',
    },
    {
      checkboxValue: 'test5',
      title: 'Invitasjon til webinar',
      description: 'Du er invitert til vårt eksklusive webinar om fremtidens teknologi.',
      sender: { label: 'Teknologi AS', icon: <PersonSuitIcon /> },
      receiver: { label: 'Bruker Brukerson', icon: <PersonIcon /> },
      tags: [
        { label: 'webinar', icon: <StarIcon /> },
        { label: 'invitasjon', icon: <EnvelopeOpenIcon /> },
      ],
      linkTo: '/inbox/5',
      date: '2024-03-10',
    },
    {
      checkboxValue: 'test6',
      title: 'Påminnelse om betaling',
      description: 'Vennligst husk å betale faktura nr. 45677 innen 15.04.2023.',
      sender: { label: 'Fakturaservice AS', icon: <PersonSuitIcon /> },
      receiver: { label: 'Bruker Brukerson', icon: <PersonIcon /> },
      tags: [
        { label: 'påminnelse', icon: <ClockDashedIcon /> },
        { label: 'faktura', icon: <SealIcon /> },
      ],
      linkTo: '/inbox/6',
      date: '2023-03-30',
    },
    {
      checkboxValue: 'test7',
      title: 'Velkommen som ny bruker!',
      description: 'Vi ønsker deg velkommen som ny bruker og ser frem til et godt samarbeid.',
      sender: { label: 'Velkomstteamet', icon: <PersonSuitIcon /> },
      receiver: { label: 'Bruker Brukerson', icon: <PersonIcon /> },
      tags: [
        { label: 'velkommen', icon: <StarIcon /> },
        { label: 'ny bruker', icon: <EnvelopeOpenIcon /> },
      ],
      linkTo: '/inbox/7',
      date: '2024-04-01',
    },
  ];

  const dataGroupedByYear = useMemo(
    () =>
      data.reduce(
        (acc: Record<string, Dialog[]>, item) => {
          const year = String(new Date(item.date).getFullYear());
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(item);
          return acc;
        },
        {} as Record<string, Dialog[]>,
      ),
    [data],
  );

  const handleCheckedChange = (checkboxValue: string, checked: boolean) => {
    setSelectedItems((prev: Record<string, boolean>) => ({
      ...prev,
      [checkboxValue]: checked,
    }));
  };

  return (
    <main>
      <h1>{t('example.your_inbox')}</h1>
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
        {Object.entries(dataGroupedByYear).map(([year, items]) => {
          const hideSelectAll = items.every((item) => selectedItems[item.checkboxValue]);
          return (
            <InboxItems key={year}>
              <InboxItemsHeader
                hideSelectAll={hideSelectAll}
                onSelectAll={() => {
                  const newItems = items
                    .map((item) => ({ key: item.checkboxValue, checked: true }))
                    .reduce((acc, item) => ({ ...acc, [item.key]: item.checked }), {});
                  setSelectedItems({
                    ...selectedItems,
                    ...newItems,
                  });
                }}
                title={year}
              />
              {items.map((item) => (
                <InboxItem
                  key={item.checkboxValue}
                  checkboxValue={item.checkboxValue}
                  title={item.title}
                  toLabel={t('word.to')}
                  description={item.description}
                  sender={item.sender}
                  receiver={item.receiver}
                  isChecked={selectedItems[item.checkboxValue]}
                  onCheckedChange={(checked) => handleCheckedChange(item.checkboxValue, checked)}
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
