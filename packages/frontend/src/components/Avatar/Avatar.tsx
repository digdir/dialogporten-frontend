import cx from 'classnames';
import { fromStringToColor } from '../../profile';
import styles from './avatar.module.css';

interface AvatarProps {
  name: string;
  companyName?: string;
  className?: string;
  size?: 'small' | 'medium';
}

export const Avatar = ({ name, companyName, className, size = 'medium' }: AvatarProps) => {
  const appliedName = companyName || name || '';
  const isOrganization = !!companyName;
  const colorType = isOrganization ? 'dark' : 'light';
  const { backgroundColor, foregroundColor } = fromStringToColor(appliedName, colorType);
  const initials = (appliedName[0] ?? '').toUpperCase();
  return (
    <div
      className={cx(styles.initialsCircle, className, {
        [styles.isOrganization]: isOrganization,
        [styles.small]: size === 'small',
      })}
      style={{ backgroundColor, color: foregroundColor }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
};
