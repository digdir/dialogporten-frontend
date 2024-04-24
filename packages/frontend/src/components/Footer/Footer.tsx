import { useTranslation } from 'react-i18next';
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
  const address = 'Digitaliseringsdirektoratet, Postboks 1382 Vika, 0114 Oslo. Org.nr. 991 825 827';

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>{address}</p>
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
    </footer>
  );
};
