import cx from 'classnames';
import styles from './dropdownListItem.module.css';
interface DropdownListItemProps {
  onClick: () => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  hasHorizontalRule?: boolean;
  isActive?: boolean;
  disabled?: boolean;
}
export const DropdownListItem = ({
  leftContent,
  rightContent,
  onClick,
  hasHorizontalRule,
  disabled,
  isActive = false,
}: DropdownListItemProps) => {
  const handleKeyUp = (event: React.KeyboardEvent<HTMLLIElement>) => {
    if (event.key === 'Enter' && !disabled) {
      onClick?.();
    }
  };
  return (
    <>
      <li
        onClick={disabled ? undefined : onClick}
        className={cx(styles.dropdownListItem, {
          [styles.disabled]: disabled,
          [styles.active]: isActive,
        })}
        onKeyUp={disabled ? undefined : handleKeyUp}
      >
        <div className={styles.content}>
          <div className={styles.leftContent}>{leftContent}</div>
          <div className={styles.rightContent}>{rightContent}</div>
        </div>
      </li>
      {hasHorizontalRule && <hr className={styles.ruler} />}
    </>
  );
};
