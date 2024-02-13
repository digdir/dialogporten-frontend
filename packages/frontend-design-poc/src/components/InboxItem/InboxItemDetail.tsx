import styles from "./inboxItemDetail.module.css";
import { useTranslation } from "react-i18next";
import { FilePdfIcon } from "@navikt/aksel-icons";

interface Attachment {
  label: string;
  href: string;
  mime?: string;
}

interface Participant {
  label: string;
  icon?: JSX.Element;
}

interface InboxItemTag {
  label: string;
  icon?: JSX.Element;
  className?: string;
}

interface InboxItemDetailProps {
  checkboxValue: string;
  title: string;
  toLabel: string;
  description: string | React.ReactNode;
  sender: Participant;
  receiver: Participant;
  attachment: Attachment[];
  tags?: InboxItemTag[];
}

export const InboxItemDetail = ({
  title,
  description,
  sender,
  receiver,
  toLabel,
  tags = [],
  attachment = [],
}: InboxItemDetailProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section className={styles.inboxItemDetail}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <div className={styles.participants}>
        <div className={styles.sender}>
          {sender?.icon && <div className={styles.icon}>{sender.icon}</div>}
          <span>{sender?.label}</span>
        </div>
        <span>{toLabel}</span>
        <div className={styles.receiver}>
          {receiver?.icon && <div className={styles.icon}>{receiver.icon}</div>}
          <span>{receiver?.label}</span>
        </div>
      </div>
      <section className={styles.descriptionContainer}>
        {typeof description === "string" ? (
          <p className={styles.description}>{description}</p>
        ) : (
          <div aria-description="description">{description}</div>
        )}
        {attachment.length > 0 ? (
          <div aria-description="attachments" className={styles.attachments}>
            <h2 className={styles.attachmentTitle}>
              {t("inbox.attachment.count", { count: attachment.length })}
            </h2>
            <ul>
              {attachment.map((entry) => (
                <li key={entry.label} className={styles.attachmentItem}>
                  <a href={entry.href}>
                    <FilePdfIcon className={styles.attachmentItemIcon} />
                    {entry.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className={styles.tags}>
          {tags.map((tag) => (
            <div key={tag.label} className={styles.tag}>
              {tag.icon && <div className={styles.tagIcon}>{tag.icon}</div>}
              <span> {tag.label}</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};
