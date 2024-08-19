import cx from 'classnames';
import { useState } from 'react';
import { fromStringToColor } from '../../profile';
import styles from './avatar.module.css';

interface AvatarProps {
  name: string;
  companyName?: string;
  className?: string;
  imageUrl?: string;
  imageUrlAlt?: string;
  size?: 'small' | 'medium';
}

export const Avatar = ({ name, companyName, className, size = 'medium', imageUrl, imageUrlAlt }: AvatarProps) => {
  const [hasImageError, setHasImageError] = useState<boolean>(false);
  const appliedName = companyName || name || '';
  const isOrganization = !!companyName;
  const colorType = isOrganization ? 'dark' : 'light';
  const { backgroundColor, foregroundColor } = fromStringToColor(appliedName, colorType);
  const initials = (appliedName[0] ?? '').toUpperCase();
  const usingImageUrl = imageUrl && !hasImageError;
  const initialStyles = !usingImageUrl
    ? {
        backgroundColor,
        color: foregroundColor,
      }
    : {};

  return (
    <div
      className={cx(styles.initialsCircle, className, {
        [styles.isOrganization]: isOrganization,
        [styles.small]: size === 'small',
      })}
      style={initialStyles}
      aria-hidden="true"
    >
      {usingImageUrl ? (
        <img
          src={imageUrl}
          className={styles.image}
          alt={imageUrlAlt || imageUrl}
          onError={() => {
            setHasImageError(true);
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
