import { InformationSquareIcon, XMarkIcon } from '@navikt/aksel-icons';
import styles from './betaBanner.module.css';

import { Button } from '@digdir/designsystemet-react';
import { useState } from 'react';

export const BetaBanner = () => {
  const betaBannerKey = 'arbeidsflate:show_beta_banner';
  const isPreviouslyDismissed = localStorage.getItem(betaBannerKey) === 'true';
  const [showBetaBanner, setShowBetaBanner] = useState<boolean>(!isPreviouslyDismissed);

  const handleClick = () => {
    setShowBetaBanner(false);
    localStorage.setItem(betaBannerKey, 'true');
  };

  if (!showBetaBanner) {
    return null;
  }

  return (
    <section className={styles.betaBanner}>
      <div className={styles.betaBannerTitle}>
        <InformationSquareIcon className={styles.infoIcon} />
        <span>
          Du ser nå på en beta-versjon av nye Altinn Innboks i et testmiljø. Alt innhold du ser her er basert på
          testdata og kun ment for demonstrasjon.
        </span>
      </div>
      <Button variant="tertiary" onClick={handleClick} type="button" className={styles.closeButton}>
        <XMarkIcon className={styles.closeIcon} />
      </Button>
    </section>
  );
};
