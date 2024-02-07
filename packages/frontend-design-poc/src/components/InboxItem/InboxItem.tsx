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
  title: string;
  toLabel: string;
  description: string;
  sender: Participant;
  receiver: Participant;
  tags?: InboxItemTag[];
}

export const InboxItem = ({
  title,
  description,
  sender,
  receiver,
  toLabel,
  tags,
}: InboxItemProps) => {
  return (
    <div className={styles.inboxItem}>
      <div>{title}</div>
      <div>{description}</div>
      <div className="participants">
        <div>
          <div>{sender.icon}</div>
          <div>{sender.label}</div>
        </div>
        <span>{toLabel}</span>
        <div>
          <div>{receiver.icon}</div>
          <div>{receiver.label}</div>
        </div>
      </div>
      <div>
        {tags?.map((tag) => (
          <div>
            {tag.icon}
            {tag.label}
          </div>
        ))}
      </div>
    </div>
  );
};
