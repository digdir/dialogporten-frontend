import { useTranslation } from 'react-i18next';
import { AltinnLogoSvg } from '../Header/AltinnLogo';
import styles from './footer.module.css';

const footerLinks = [
  {
    href: 'https://info.altinn.no/om-altinn/',
    resourceId: 'footer.nav.about_altinn',
  },
  {
    href: 'https://info.altinn.no/om-altinn/driftsmeldinger/',
    resourceId: 'footer.nav.service_messages',
  },
  {
    href: 'https://info.altinn.no/om-altinn/personvern/',
    resourceId: 'footer.nav.privacy_policy',
  },
  {
    href: 'https://info.altinn.no/om-altinn/tilgjengelighet/',
    resourceId: 'footer.nav.accessibility',
  },
];
export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer} data-testid="main-footer">
      <div className={styles.content}>
        <div>
          <p className={styles.company}>
            <AltinnLogoSvg small /> {t('footer.company')}
          </p>
          <p className={styles.addressLineOne}>{t('footer.address.line1')}</p>
          <p className={styles.addressLineTwo}>{t('footer.address.line2')}</p>
        </div>
        <div>
          <ul className={styles.links}>
            {footerLinks.map((link) => (
              <li key={link.resourceId}>
                <a href={link.href} className={styles.link}>
                  {t(link.resourceId)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
