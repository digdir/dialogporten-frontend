import cx from 'classnames';
import { useState } from 'react';
import { fromStringToColor } from '../../profile';
import styles from './avatar.module.css';

export type AvatarProfile = 'organization' | 'person';

interface AvatarProps {
  name: string;
  profile?: AvatarProfile;
  className?: string;
  imageUrl?: string;
  imageUrlAlt?: string;
  size?: 'small' | 'medium';
}

export const Avatar = ({
  name,
  className,
  size = 'medium',
  profile = 'person',
  imageUrl,
  imageUrlAlt,
}: AvatarProps) => {
  const [hasImageError, setHasImageError] = useState<boolean>(false);
  const isOrganization = profile === 'organization';
  const colorSchema = isOrganization ? 'dark' : 'light';
  const { backgroundColor, foregroundColor } = fromStringToColor(name, colorSchema);
  const initials = (name[0] ?? '').toUpperCase();
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
