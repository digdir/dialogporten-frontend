import { ChevronRightIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './sidebarItem.module.css';

export type SidebarItemProps = {
  displayText: string;
  label: string;
  icon: JSX.Element;
  count?: number;
  path: string;
  isActive?: boolean;
  isInbox?: boolean;
  isButton?: boolean;
  isCompany?: boolean;
  className?: string;
  type?: 'primary' | 'secondary' | 'menuItem';
  disabled?: boolean;
};

/**
 * SidebarItem is a navigational component designed to be used as part of a sidebar menu.
 * It displays an item with an icon and text, and optionally a counter badge if a count is provided.
 * The component can be styled differently if it represents an inbox item or a button.
 *
 * @component
 * @param {string} props.displayText - The text to display for the sidebar item.
 * @param {string} props.label - The accessible label for the sidebar item, used by screen readers.
 * @param {JSX.Element} props.icon - The icon to display next to the sidebar item text.
 * @param {number} [props.count] - Optional count to display as a badge, indicating the number of items or notifications.
 * @param {string} props.path - The URL that the sidebar item links to.
 * @param {boolean} [props.isInbox=false] - Flag indicating whether the item is an inbox item, which may change styling.
 * @param {boolean} [props.isActive=false] - Flag indicating whether the item is active or inactive, which may change styling.
 * @param {boolean} [props.isButton=false] - Flag indicating whether the item should behave as a button, including keyboard interaction.
 * @param {boolean} [props.isCompany=false] - Flag indicating whether the item should use company design or not.
 * @param {'primary' | 'secondary'} [props.type='primary'] - Choose between primary and secondary design.
 * @returns {JSX.Element} The SidebarItem component.
 *
 * @example
 * <SidebarItem
 *   displayText="Innboks"
 *   label="Gå til innboks"
 *   icon={<InboxFillIcon />}
 *   count={3}
 *   path="/innboks"
 *   isInbox
 * />
 *
 * @example
 * <SidebarItem
 *   displayText="Sendt"
 *   label="Gå til sendte elementer"
 *   icon={<FileCheckmarkIcon />}
 *   count={5}
 *   path="/sendt"
 * />
 */

export const SidebarItem: React.FC<SidebarItemProps> = ({
  displayText,
  label,
  icon,
  count,
  path,
  isInbox,
  isButton,
  isCompany,
  className,
  type = 'primary',
  isActive = false,
  disabled = false,
}: SidebarItemProps): JSX.Element => {
  const { t } = useTranslation();
  const ariaTextCounter = t('sidebar.unread_messages.aria_counter', { count });
  const isMenuItem = type === 'menuItem';
  return (
    <Link to={path} className={cx(styles.link, { [styles.disabled]: disabled })} aria-label={label}>
      <div
        className={cx(
          styles.sidebarItem,
          {
            [styles.isButton]: isButton,
            [styles.isCompany]: isCompany,
            [styles.active]: isActive,
          },
          className,
        )}
      >
        <div className={styles.iconAndText}>
          <span
            className={cx(styles.icon, {
              [styles.isInbox]: isInbox,
              [styles.isCompany]: isCompany,
              [styles.isPrimary]: type === 'primary',
              [styles.isMenuItem]: isMenuItem,
            })}
            aria-hidden="true"
          >
            {icon}
          </span>
          <span className={cx(styles.displayText, { [styles.isInbox]: isInbox })}>{displayText}</span>
        </div>
        <div className={styles.counterAndIcon}>
          {!!count && (
            <span
              className={cx(styles.counter, {
                [styles.redCounter]: isInbox,
              })}
              aria-label={ariaTextCounter}
            >
              {count > 100 ? '100+' : count}
            </span>
          )}
          {isMenuItem && <ChevronRightIcon className={styles.arrowIcon} />}
        </div>
      </div>
    </Link>
  );
};
