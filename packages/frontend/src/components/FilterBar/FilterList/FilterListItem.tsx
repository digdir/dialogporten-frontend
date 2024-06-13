import cx from 'classnames';
import styles from './filterListItem.module.css';
interface FilterListItemProps {
  onClick: () => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  hasBottomBorder?: boolean;
  filterActive?: boolean;
  disabled?: boolean;
}
export const FilterListItem = ({
  leftContent,
  rightContent,
  onClick,
  hasBottomBorder,
  disabled,
  filterActive = false,
}: FilterListItemProps) => {
  const handleKeyUp = (event: React.KeyboardEvent<HTMLLIElement>) => {
    if (event.key === 'Enter' && !disabled) {
      onClick?.();
    }
  };
  return (
    <li
      onClick={disabled ? undefined : onClick}
      className={cx(styles.filterListItem, {
        [styles.disabled]: disabled,
        [styles.hasBottomBorder]: hasBottomBorder,
        [styles.activeFilter]: filterActive,
      })}
      onKeyUp={disabled ? undefined : handleKeyUp}
    >
      <div className={styles.content}>
        <div className={styles.leftContent}>{leftContent}</div>
        <div className={styles.rightContent}>{rightContent}</div>
      </div>
    </li>
  );
};
