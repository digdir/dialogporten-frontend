import { Link } from '@digdir/designsystemet-react';
import { FileIcon } from '@navikt/aksel-icons';
import { AttachmentUrlConsumer } from 'bff-types-generated';
import { useTranslation } from 'react-i18next';
import { type DialogByIdDetails, getPropertyByCultureCode } from '../../api/useDialogById.tsx';
import { Avatar } from '../Avatar';
import { MainContentReference } from '../MainContentReference';
import { GuiActions } from './GuiActions.tsx';
import styles from './inboxItemDetail.module.css';

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
    dialogToken,
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
  const attachmentCount = attachments.reduce(
    (count, { urls }) => count + urls.map((url) => url.consumerType === 'GUI').length,
    0,
  );

  return (
    <section className={styles.inboxItemDetail}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <div className={styles.participants}>
        <div className={styles.sender}>
          <Avatar name={sender?.name ?? ''} imageUrl={sender?.imageURL} />
          <span className={styles.participantLabel}>{sender?.name}</span>
        </div>
        <span>{toLabel}</span>
        <div className={styles.receiver}>
          <span className={styles.participantLabel}>{receiver?.name}</span>
        </div>
      </div>
      <section className={styles.descriptionContainer}>
        {typeof description === 'string' ? (
          <p className={styles.description}>{description}</p>
        ) : (
          <div>{description}</div>
        )}
        {mainContentReference && <MainContentReference args={mainContentReference} dialogToken={dialogToken} />}
        <section>
          <h2 className={styles.attachmentTitle}>{t('inbox.heading.attachments', { count: attachmentCount })}</h2>
          <ul className={styles.attachments}>
            {attachments.map((attachment) =>
              attachment.urls
                .filter((url) => url.consumerType === AttachmentUrlConsumer.Gui)
                .map((url) => (
                  <li key={url.id} className={styles.attachmentItem}>
                    <FileIcon fontSize="1.5rem" />
                    <Link
                      href={url.url}
                      aria-label={t('inbox.attachment.link', {
                        label: url.url,
                      })}
                    >
                      {getPropertyByCultureCode(attachment.displayName) || url.url}
                    </Link>
                  </li>
                )),
            )}
          </ul>
        </section>
        <GuiActions
          actions={guiActions}
          dialogToken={dialogToken}
          onDeleteSuccess={() => {
            // TODO: Redirect to inbox
          }}
        />
        <div className={styles.tags}>
          {tags.map((tag) => (
            <div key={tag.label} className={styles.tag}>
              {tag.icon && <div className={styles.tagIcon}>{tag.icon}</div>}
              <span> {tag.label}</span>
            </div>
          ))}
        </div>
      </section>
      {additionalInfo && <section className={styles.additionalInfo}>{additionalInfo}</section>}
    </section>
  );
};
