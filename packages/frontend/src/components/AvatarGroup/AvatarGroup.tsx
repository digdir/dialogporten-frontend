import { Avatar, type AvatarProfile } from '../Avatar';
import styles from './avatarGroup.module.css';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  imageUrlAlt?: string;
}
interface AvatarGroupProps {
  avatars: AvatarProps[];
  profile?: AvatarProfile;
  size?: 'small' | 'medium';
}

const MAX_AVATARS = 4;

const getPixel = (index: number, total: number) => {
  if (index === 0) {
    return 0;
  }

  if (total === 2) {
    return -5;
  }

  return index * -(total * MAX_AVATARS + 2);
};

export const AvatarGroup = ({ avatars, profile, size = 'small' }: AvatarGroupProps) => {
  const avatarsToShow = avatars.slice(0, MAX_AVATARS);

  if (avatars.length === 0) {
    return <div className={styles.avatarGroup} />;
  }

  return (
    <div className={styles.avatarGroup}>
      {avatarsToShow.map((avatar, index) => {
        const pixels = getPixel(index, avatarsToShow.length);
        const styleTransform = { transform: `translateX(${pixels}px)` };
        const lastLegalAvatarReached = index === MAX_AVATARS - 1;

        return (
          <div className={styles.floatingAvatar} key={avatar.name} style={styleTransform}>
            <Avatar
              name={avatar.name}
              customDisplayLabel={lastLegalAvatarReached ? avatars.length.toString() : undefined}
              imageUrl={avatar.imageUrl}
              imageUrlAlt={avatar.imageUrlAlt}
              profile={profile}
              size={size}
              outline
            />
          </div>
        );
      })}
    </div>
  );
};
