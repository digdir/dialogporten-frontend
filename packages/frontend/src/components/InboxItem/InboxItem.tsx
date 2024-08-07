import classNames from 'classnames';
import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { useSelectedDialogs } from '../PageLayout';

import { ProfileCheckbox } from '../ProfileCheckbox';
import styles from './inboxItem.module.css';

export interface Participant {
  label: string;
  icon?: JSX.Element;
}

export interface InboxItemTag {
  label: string;
  icon?: JSX.Element;
  className?: string;
}

interface InboxItemProps {
  checkboxValue: string;
  title: string;
  toLabel: string;
  description: string;
  sender: Participant;
  receiver: Participant;
  isChecked?: boolean;
  onCheckedChange?: (value: boolean) => void;
  tags?: InboxItemTag[];
  isUnread?: boolean;
  linkTo?: string;
  isMinimalistic?: boolean;
  onClose?: () => void;
}

export const OptionalLinkContent = ({
  children,
  linkTo,
}: {
  children: React.ReactNode;
  linkTo: string | undefined;
}) => {
  if (linkTo) {
    return (
      <Link to={linkTo} className={styles.link}>
        {children}
      </Link>
    );
  }
  return children;
};

/**
 * Represents an individual inbox item, displaying information such as the title,
 * description, sender, and receiver, along with optional tags. It includes a checkbox
 * to mark the item as checked/unchecked and can visually indicate if it is unread.
 * Should only be used as child of InboxItems
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.checkboxValue - The value attribute for the checkbox input.
 * @param {string} props.title - The title of the inbox item.
 * @param {string} props.toLabel - The label for "to" for full i18n support.
 * @param {string} props.description - The description or content of the inbox item.
 * @param {Participant} props.sender - The sender of the inbox item, including label and optional icon.
 * @param {Participant} props.receiver - The receiver of the inbox item, including label and optional icon.
 * @param {boolean} props.isChecked - Whether the inbox item is checked. This can support batch operations.
 * @param {function(boolean): void} props.onCheckedChange - Callback function triggered when the checkbox value changes.
 * @param {InboxItemTag[]} [props.tags=[]] - Optional array of tags associated with the inbox item, each with a label, optional icon, and optional className.
 * @param {boolean} [props.isUnread=false] - Whether the inbox item should be styled to indicate it is unread.
 * @param {string} [props.linkTo=undefined] - When provided a href it renders a link as title for navigation.
 * @returns {JSX.Element} The InboxItem component.
 *
 * @example
 * <InboxItem
 *   checkboxValue="item1"
 *   title="Meeting Reminder"
 *   toLabel="to"
 *   description="Don't forget the meeting tomorrow at 10am."
 *   sender={{ label: "Alice", icon: <MailIcon /> }}
 *   receiver={{ label: "Bob", icon: <PersonIcon /> }}
 *   isChecked={false}
 *   onCheckedChange={(checked) => console.log(checked)}
 *   tags={[{ label: "Urgent", icon: <WarningIcon />, className: "urgent" }]}
 *   isUnread
 * />
 */
export const InboxItem = ({
  title,
  description,
  sender,
  receiver,
  toLabel,
  tags = [],
  isChecked = false,
  onCheckedChange,
  checkboxValue,
  isUnread = false,
  linkTo,
  isMinimalistic = false,
  onClose,
}: InboxItemProps): JSX.Element => {
  const { inSelectionMode } = useSelectedDialogs();

  const onClick = () => {
    if (inSelectionMode && onCheckedChange) {
      onCheckedChange(!checkboxValue);
    }
    if (isMinimalistic) {
      onClose?.();
    }
  };

  if (isMinimalistic) {
    return (
      <div
        className={classNames(styles.inboxItemWrapper, {
          [styles.active]: isChecked,
          [styles.pointer]: inSelectionMode,
          [styles.minimalistic]: isMinimalistic,
        })}
        aria-selected={isChecked ? 'true' : 'false'}
        onClick={onClick}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
          }
        }}
      >
        <OptionalLinkContent linkTo={!inSelectionMode ? linkTo : undefined}>
          <section
            className={classNames(styles.inboxItem, {
              [styles.isUnread]: isUnread,
            })}
          >
            <header className={styles.header}>
              <h2 className={styles.title}>{title}</h2>
              {onCheckedChange && (
                <ProfileCheckbox
                  checked={isChecked}
                  value={checkboxValue}
                  onClick={(e) => {
                    if (e.currentTarget === e.target) {
                      e.stopPropagation();
                    }
                  }}
                  onChange={(e) => {
                    onCheckedChange?.(e.target.checked);
                  }}
                  size="sm"
                />
              )}
            </header>
            <p className={styles.description}>{description}</p>
          </section>
        </OptionalLinkContent>
      </div>
    );
  }

  return (
    <li
      className={classNames(styles.inboxItemWrapper, {
        [styles.active]: isChecked,
        [styles.hoverable]: linkTo,
        [styles.pointer]: inSelectionMode,
      })}
      aria-selected={isChecked ? 'true' : 'false'}
      onClick={onClick}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <OptionalLinkContent linkTo={!inSelectionMode ? linkTo : undefined}>
        <section
          className={classNames(styles.inboxItem, {
            [styles.isUnread]: isUnread,
          })}
        >
          <header className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {onCheckedChange && (
              <ProfileCheckbox
                checked={isChecked}
                value={checkboxValue}
                onClick={(e) => {
                  if (e.currentTarget === e.target) {
                    e.stopPropagation();
                  }
                }}
                onChange={(e) => {
                  onCheckedChange?.(e.target.checked);
                }}
                size="sm"
              />
            )}
          </header>
          <div className={styles.participants}>
            <div className={styles.sender}>
              {sender?.icon && <div className={styles.senderIcon}>{sender.icon}</div>}
              <span className={styles.participantLabel}>{sender?.label}</span>
            </div>
            <span>{toLabel}</span>
            <div className={styles.receiver}>
              {receiver?.icon && <div className={styles.icon}>{receiver.icon}</div>}
              <span className={styles.participantLabel}>{receiver?.label}</span>
            </div>
          </div>
          <p className={styles.description}>{description}</p>
          <div className={styles.tags}>
            {tags.map((tag) => (
              <div key={tag.label} className={styles.tag}>
                {tag.icon && <div className={styles.icon}>{tag.icon}</div>}
                <span> {tag.label}</span>
              </div>
            ))}
          </div>
        </section>
      </OptionalLinkContent>
    </li>
  );
};
