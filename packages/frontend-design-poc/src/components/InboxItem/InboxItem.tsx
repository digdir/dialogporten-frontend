import { Checkbox } from "@digdir/design-system-react";
import classNames from "classnames";

import styles from "./inboxItem.module.css";

interface Participant {
  label: string;
  icon?: JSX.Element;
}

interface InboxItemTag {
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
  isChecked: boolean;
  onCheckedChange: (value: boolean) => void;
  tags?: InboxItemTag[];
  isUnread?: boolean;
}

export const InboxItem = ({
  title,
  description,
  sender,
  receiver,
  toLabel,
  tags = [],
  isChecked,
  onCheckedChange,
  checkboxValue,
  isUnread = false,
}: InboxItemProps) => {
  return (
    <div
      className={classNames(styles.inboxItemWrapper, {
        [styles.active]: isChecked,
        [styles.isUnread]: isUnread,
      })}
      aria-selected={isChecked ? "true" : "false"}
      tabIndex={0}
    >
      <section className={styles.inboxItem}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <Checkbox
            checked={isChecked}
            value={checkboxValue}
            onChange={(e) => onCheckedChange(e.target.checked)}
            size="small"
          />
        </header>
        <div className={styles.participants}>
          <div className={styles.sender}>
            {sender.icon && <div className={styles.icon}>{sender.icon}</div>}
            <span>{sender.label}</span>
          </div>
          <span>{toLabel}</span>
          <div className={styles.receiver}>
            {receiver.icon && (
              <div className={styles.icon}>{receiver.icon}</div>
            )}
            <span>{receiver.label}</span>
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
    </div>
  );
};
