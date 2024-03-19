import cx from 'classnames';
import styles from './filterListItem.module.css';
interface FilterListItemProps {
  onClick: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}
export const FilterListItem = ({ children, onClick, disabled }: FilterListItemProps) => {
  const handleKeyUp = (event: React.KeyboardEvent<HTMLLIElement>) => {
    if (event.key === 'Enter' && !disabled) {
      onClick?.();
    }
  };
  return (
    <li
      onClick={disabled ? undefined : onClick}
      className={cx(styles.filterListItem, { [styles.disabled]: disabled })}
      onKeyUp={disabled ? undefined : handleKeyUp}
    >
      {children}
    </li>
  );
};
