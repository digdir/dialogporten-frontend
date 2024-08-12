import cx from 'classnames';
import styles from './avatar.module.css';

const getInitials = (name: string, companyName?: string) => {
  if (!companyName?.length) {
    return name[0];
  }

  return companyName[0];
};

interface AvatarProps {
  name: string;
  companyName?: string;
  className?: string;
  size?: 'small' | 'medium';
}

export const Avatar = ({ name, companyName, className, size = 'medium' }: AvatarProps) => {
  return (
    <div
      className={cx(styles.initialsCircle, className, {
        [styles.isOrganization]: !!companyName,
        [styles.small]: size === 'small',
      })}
      aria-hidden="true"
    >
      {getInitials(name, companyName)}
    </div>
  );
};
