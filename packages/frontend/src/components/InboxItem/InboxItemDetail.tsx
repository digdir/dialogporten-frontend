import { Link } from '@digdir/designsystemet-react';
import { FileIcon } from '@navikt/aksel-icons';
import { AttachmentUrlConsumer } from 'bff-types-generated';
import { Markdown } from 'embeddable-markdown-html';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type DialogByIdDetails, getPropertyByCultureCode } from '../../api/useDialogById.tsx';
import { GuiActions } from './GuiActions.tsx';
import styles from './inboxItemDetail.module.css';

const MainContentReference = (args: DialogByIdDetails['mainContentReference']) => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    if (!args || !args.url || args.type === 'unknown') {
      return;
    }

    // TODO: fetch url and get markdown
    setMarkdown('# example markdown');
  }, [args]);

  if (!args || !args.url || args.type === 'unknown') {
    return null;
  }

  switch (args.type) {
    case 'markdown':
      return <Markdown>{markdown}</Markdown>;

    default:
      return <div>Error parsing 'mainContentReference', unknown type</div>;
  }
};

/**
 * Displays detailed information about an inbox item, including title, description, sender, receiver, attachments, tags, and GUI actions.
 * This component is intended to be used for presenting a full view of an inbox item, with comprehensive details not shown in the summary view.
 * It supports rendering both text and React node descriptions, and dynamically lists attachments with links.
 * Dynamically rendered action buttons are implemented through the `GuiActions` component.
 *
 * @component
 * @param {object} props - The properties passed to the component.
 * @param {DialogByIdDetails} props.dialog - The dialog details containing all the necessary information.
 * @returns {JSX.Element} The InboxItemDetail component.
 *
 * @example
 * <InboxItemDetail
 *   dialog={{
 *     title: "Project Update",
 *     description: <p>Here's the latest update on the project...</p>,
 *     sender: { label: "Alice", icon: <PersonIcon /> },
 *     receiver: { label: "Bob", icon: <PersonIcon /> },
 *     toLabel: "to",
 *     attachment: [{ label: "Project Plan", href: "/path/to/document", mime: "application/pdf" }],
 *     tags: [{ label: "Important", icon: <FlagIcon />, className: "important" }],
 *     guiActions: [{ label: "Approve", onClick: () => alert('Approved') }]
 *   }}
 * />
 */
export const InboxItemDetail = ({
  dialog: {
    title,
    description,
    sender,
    receiver,
    toLabel,
    guiActions,
    tags = [],
    additionalInfo,
    attachments,
    mainContentReference,
  },
}: { dialog: DialogByIdDetails }): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section className={styles.inboxItemDetail}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <div className={styles.participants}>
        <div className={styles.sender}>
          {sender?.icon && <div className={styles.participantIcon}>{sender.icon}</div>}
          <span>{sender?.label}</span>
        </div>
        <span>{toLabel}</span>
        <div className={styles.receiver}>
          {receiver?.icon && <div className={styles.participantIcon}>{receiver.icon}</div>}
          <span>{receiver?.label}</span>
        </div>
      </div>
      <section className={styles.descriptionContainer}>
        {typeof description === 'string' ? (
          <p className={styles.description}>{description}</p>
        ) : (
          <div>{description}</div>
        )}
        <GuiActions actions={guiActions} />
        <div className={styles.tags}>
          {tags.map((tag) => (
            <div key={tag.label} className={styles.tag}>
              {tag.icon && <div className={styles.tagIcon}>{tag.icon}</div>}
              <span> {tag.label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.activities}>
        <h2>{t('inbox.heading.events', { count: attachments.length })}</h2>
        {attachments
          .slice()
          .reverse()
          .map((attachment) => {
            const attachmentCount = attachment.urls.length;
            return (
              <section key={attachment.id}>
                <span>Performed by: TODO</span>
                <div className={styles.elements}>
                  <h2 id="attachmentTitle" className={styles.attachmentTitle}>
                    {t('inbox.attachment.count', {
                      count: attachmentCount,
                    })}
                    <ul className={styles.attachmentItem}>
                      {attachment.urls
                        .filter((url) => url.consumerType === AttachmentUrlConsumer.Gui)
                        .map((url) => (
                          <li key={url.url}>
                            {/* TODO: Icon should render differently depending on url.mediaType */}
                            <FileIcon />
                            <Link
                              href={url.url}
                              aria-label={t('inbox.attachment.link', {
                                label: url.url,
                              })}
                            >
                              {getPropertyByCultureCode(attachment.displayName) || url.url}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </h2>
                </div>
              </section>
            );
          })}
      </section>
      {additionalInfo && <section className={styles.additionalInfo}>{additionalInfo}</section>}
      {mainContentReference && <MainContentReference {...mainContentReference} />}
    </section>
  );
};
