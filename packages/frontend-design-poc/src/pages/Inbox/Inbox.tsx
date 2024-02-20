import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PersonIcon, PersonSuitIcon, SealIcon, StarIcon } from '@navikt/aksel-icons';
import { InboxItem, InboxItems } from '../../components';
import { ActionPanel } from '../../components';

export const Inbox = () => {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isChecked2, setIsChecked2] = useState<boolean>(false);

  return (<section>
      <h1>{t('example.your_inbox')}</h1>
      <ActionPanel actionButtons={[]} />
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
          tags={[{ label: 'hello', icon: <StarIcon /> }, { label: 'hallaz', icon: <SealIcon /> }]}
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
          tags={[{ label: 'hello', icon: <StarIcon /> }, { label: 'hallaz', icon: <SealIcon /> }]}
          linkTo="/inbox/2"
        />
      </InboxItems>
    </section>);
};
