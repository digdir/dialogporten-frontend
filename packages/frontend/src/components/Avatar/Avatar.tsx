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
  type?: 'small' | 'normal';
}

export const Avatar = ({ name, companyName, className, type = 'normal' }: AvatarProps) => {
  return (
    <div
      className={cx(styles.initialsCircle, className, {
        [styles.isOrganization]: !!companyName,
        [styles.small]: type === 'small',
      })}
      aria-hidden="true"
    >
      {getInitials(name, companyName)}
    </div>
  );
};
