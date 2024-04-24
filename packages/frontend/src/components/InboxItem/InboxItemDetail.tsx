import { FilePdfIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import styles from './inboxItemDetail.module.css';

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

/**
 * Displays detailed information about an inbox item, including title, description, sender, receiver, attachments, and tags.
 * This component is intended to be used for presenting a full view of an inbox item, with comprehensive details not shown in the summary view.
 * It supports rendering both text and React node descriptions, and dynamically lists attachments with links.
 * Dynamically rendered action button are at the moment intentionally not implemented.
 *
 * @component
 * @param {InboxItemDetailProps} props - The properties passed to the component.
 * @param {string} props.title - The title of the inbox item.
 * @param {string | React.ReactNode} props.description - The detailed description of the inbox item. Can be a string or any React node.
 * @param {Participant} props.sender - The sender of the inbox item, including label and optional icon.
 * @param {Participant} props.receiver - The receiver of the inbox item, including label and optional icon.
 * @param {string} props.toLabel - The label indicating the receiver, supports full i18n integration.
 * @param {InboxItemTag[]} [props.tags=[]] - Optional array of tags associated with the inbox item, each with a label, optional icon, and optional className.
 * @param {Attachment[]} [props.attachment=[]] - An array of attachments associated with the inbox item, each with a label and href. Mime type is optional.
 * @returns {JSX.Element} The InboxItemDetail component.
 *
 * @example
 * <InboxItemDetail
 *   title="Project Update"
 *   description={<p>Here's the latest update on the project...</p>}
 *   sender={{ label: "Alice", icon: <PersonIcon /> }}
 *   receiver={{ label: "Bob", icon: <PersonIcon /> }}
 *   toLabel="to"
 *   attachment={[{ label: "Project Plan", href: "/path/to/document", mime: "application/pdf" }]}
 *   tags={[{ label: "Important", icon: <FlagIcon />, className: "important" }]}
 * />
 */
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
        {typeof description === 'string' ? (
          <p className={styles.description}>{description}</p>
        ) : (
          <div>{description}</div>
        )}
        {attachment.length > 0 && (
          <div className={styles.attachments} aria-labelledby="attachmentTitle">
            <h2 id="attachmentTitle" className={styles.attachmentTitle}>
              {t('inbox.attachment.count', { count: attachment.length })}
            </h2>
            <ul>
              {attachment.map((entry) => (
                <li key={entry.label} className={styles.attachmentItem}>
                  <a
                    href={entry.href}
                    aria-label={t('inbox.attachment.link', {
                      label: entry.label,
                    })}
                  >
                    <FilePdfIcon className={styles.attachmentItemIcon} />
                    {entry.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
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
