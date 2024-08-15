import cx from 'classnames';
import styles from './badge.module.css';
interface BadgeProps {
  label?: string | number;
  variant?: 'neutral' | 'strong';
  size?: 'medium' | 'small';
}

// TODO: add aria-label to the badge
export const Badge = ({ label, variant = 'neutral', size = 'medium' }: BadgeProps) => {
  const classNames = cx(styles.badge, {
    [styles.strong]: variant === 'strong',
    [styles.small]: size === 'small',
  });
  return <span className={classNames}>{label}</span>;
};
