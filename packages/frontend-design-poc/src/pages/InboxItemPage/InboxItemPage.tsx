import { ClockIcon, EyeWithPupilIcon, PersonSuitIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../../components/BackButton';
import { InboxItemDetail } from '../../components/InboxItem';
import styles from './inboxItemPage.module.css';

// This could e.g. be the output of a react-markdown conversion and contain basic HTML elements
const ExampleDescription = () => {
  return (
    <section>
      <p>Du har utbetalt krav på totalt kr. 2300</p>
      <ul>
        <li>Restskatt, person (2022): Kr. 300</li>
        <li>Restskatt, person (2021): Kr. 2000</li>
      </ul>
      <p>Du må betale kravet snarest, og senest innen 7 dager.</p>
      <ul>
        <li>
          <b>Å betale: </b>Kr. 2300
        </li>
        <li>
          <b>Kontonummer: </b>1234567890
        </li>
        <li>
          <b>KID: </b>1234567890123456789012345
        </li>
        <li>
          <b>Forfallsdato: </b>31.01.2023
        </li>
      </ul>
    </section>
  );
};

export const InboxItemPage = () => {
  const { t } = useTranslation();
  const docs = [
    {
      label: 'Betalingspåminnelse.pdf',
      href: '/path/to/important/doc',
    },
    { label: 'Retningslinjer for straff.pdf', href: '/path/to/some/doc' },
  ];
  return (
    <main className={styles.itemInboxPage}>
      <nav>
        <BackButton pathTo="/inbox/" />
      </nav>
      <InboxItemDetail
        checkboxValue="test"
        title="Viktig melding"
        toLabel={t('word.to')}
        description={<ExampleDescription />}
        sender={{ label: 'Viktig bedrift', icon: <PersonSuitIcon /> }}
        receiver={{ label: 'Bruker Brukerson' }}
        tags={[
          { label: '12. desember 2023', icon: <ClockIcon /> },
          {
            label: 'Sett av deg',
            icon: <EyeWithPupilIcon />,
          },
        ]}
        attachment={docs}
      />
    </main>
  );
};
