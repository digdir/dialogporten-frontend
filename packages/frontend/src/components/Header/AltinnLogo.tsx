import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './altinnLogo.module.css';

export function AltinnLogoSvg({ small }: { small?: boolean }) {
  return (
    <svg
      className={small ? styles.altinnLogoSmall : styles.altinnLogo}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Altinn logo</title>
      <g id="SVG" clipPath="url(#clip0_272_15462)">
        <path
          id="Vector"
          d="M16.4223 0H0.648079C0.476197 0 0.311357 0.0681372 0.189817 0.189421C0.0682796 0.310707 0 0.475203 0 0.646725V31.3533C0 31.5248 0.0682796 31.6893 0.189817 31.8105C0.311357 31.9319 0.476197 32 0.648079 32H16.4223C20.594 31.8816 24.5551 30.1447 27.4639 27.1581C30.3727 24.1717 32 20.1712 32 16.0065C32 11.8418 30.3727 7.84119 27.4639 4.85475C24.5551 1.86829 20.594 0.131336 16.4223 0.0129348V0ZM17.9647 27.1753C15.578 27.5853 13.1227 27.2265 10.9539 26.1509C8.78521 25.0755 7.01584 23.3389 5.90201 21.1931C4.78819 19.0471 4.38771 16.6031 4.75856 14.2148C5.12943 11.8267 6.25239 9.61827 7.96483 7.9094C9.67727 6.20053 11.8903 5.07992 14.2835 4.70983C16.6767 4.33975 19.1259 4.73939 21.2763 5.85089C23.4267 6.9624 25.1667 8.72807 26.2445 10.8922C27.3224 13.0564 27.6819 15.5068 27.2712 17.8884C26.8713 20.2063 25.7621 22.3435 24.0956 24.0065C22.4291 25.6695 20.2873 26.7765 17.9647 27.1753Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_272_15462">
          <rect className={small ? styles.altinnLogoSmall : styles.altinnLogo} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

interface AltinnLogoProps {
  className?: string;
}

export const AltinnLogo = ({ className }: AltinnLogoProps) => {
  const { t } = useTranslation();
  return (
    <div className={className}>
      <Link to="/" aria-label={t('link.goToMain')}>
        <div className={styles.logoWrapper}>
          <AltinnLogoSvg aria-label="Altinn logo" />
        </div>
        <span>Altinn</span>
      </Link>
    </div>
  );
};
