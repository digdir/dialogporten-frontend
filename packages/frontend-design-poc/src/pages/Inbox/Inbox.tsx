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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionPanel } from '../../components';
import { InboxItem, InboxItems } from '../../components/InboxItem';
import styles from './inbox.module.css';

export const Inbox = () => {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isChecked2, setIsChecked2] = useState<boolean>(false);
  const selectedItemCount = [isChecked, isChecked2].filter(Boolean).length;

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
            onUndoSelection={() => {
              setIsChecked(false);
              setIsChecked2(false);
            }}
          />
        </div>
      )}
      <InboxItems>
        <InboxItem
          checkboxValue="test"
          title="Viktig melding"
          toLabel={t('word.to')}
          description="Du har mottatt en viktig melding!"
          sender={{ label: 'Viktig bedrift', icon: <PersonSuitIcon /> }}
          receiver={{ label: 'Bruker Brukerson', icon: <PersonIcon /> }}
          isChecked={isChecked}
          onCheckedChange={(checked) => {
            setIsChecked(checked);
          }}
          tags={[
            { label: 'hello', icon: <StarIcon /> },
            { label: 'hallaz', icon: <SealIcon /> },
          ]}
          linkTo="/inbox/1"
        />
        <InboxItem
          checkboxValue="test2"
          title="Har du glemt oss?"
          toLabel={t('word.to')}
          description="Det tror jeg du har!"
          sender={{ label: 'Viktig bedrift', icon: <PersonSuitIcon /> }}
          receiver={{ label: 'Bruker Brukerson', icon: <PersonIcon /> }}
          isChecked={isChecked2}
          onCheckedChange={(checked) => {
            setIsChecked2(checked);
          }}
          tags={[
            { label: 'hello', icon: <StarIcon /> },
            { label: 'hallaz', icon: <SealIcon /> },
          ]}
          linkTo="/inbox/2"
        />
      </InboxItems>
    </main>
  );
};
