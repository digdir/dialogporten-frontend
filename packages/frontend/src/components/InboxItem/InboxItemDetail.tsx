import { Link } from '@digdir/designsystemet-react';
import { EyeIcon, FileIcon } from '@navikt/aksel-icons';
import { AttachmentUrlConsumer } from 'bff-types-generated';
import { useTranslation } from 'react-i18next';
import { type DialogByIdDetails, getPropertyByCultureCode } from '../../api/useDialogById.tsx';
import { useFormat } from '../../i18n/useDateFnsLocale.tsx';
import { Activity } from '../Activity';
import { Avatar } from '../Avatar';
import { MainContentReference } from '../MainContentReference';
import { GuiActions } from './GuiActions.tsx';
import styles from './inboxItemDetail.module.css';

interface InboxItemDetailProps {
  dialog: DialogByIdDetails | undefined | null;
}

/**
 * Displays detailed information about an inbox item, including title, summary, sender, receiver, attachments, tags, and GUI actions.
 * This component is intended to be used for presenting a full view of an inbox item, with comprehensive details not shown in the summary view.
 * It supports rendering both text and React node summarys, and dynamically lists attachments with links.
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
 *     summary: "Here's the latest update on the project...",
 *     sender: { name: "Alice", icon: <PersonIcon /> },
 *     receiver: { name: "Bob", icon: <PersonIcon /> },
 *     attachment: [{ label: "Project Plan", href: "/path/to/document", mime: "application/pdf" }],
 *     tags: [{ label: "Important", icon: <FlagIcon />, className: "important" }],
 *     guiActions: [{ label: "Approve", onClick: () => alert('Approved') }]
 *   }}
 * />
 */

export const InboxItemDetail = ({ dialog }: InboxItemDetailProps): JSX.Element => {
  const { t } = useTranslation();
  const format = useFormat();

  if (!dialog) {
    return (
      <div className={styles.inboxItemDetailWrapper}>
        <section className={styles.inboxItemDetail}>
          <header className={styles.header} data-id="dialog-header">
            <h1 className={styles.title}>{t('error.dialog.not_found')}</h1>
          </header>
          <p className={styles.summary}>{t('dialog.error_message')}</p>
        </section>
      </div>
    );
  }

  const {
    title,
    dialogToken,
    summary,
    sender,
    receiver,
    guiActions,
    metaFields = [],
    additionalInfo,
    attachments,
    mainContentReference,
    activities,
    updatedAt,
  } = dialog;
  const attachmentCount = attachments.reduce(
    (count, { urls }) => count + urls.map((url) => url.consumerType === 'GUI').length,
    0,
  );

  const clockPrefix = t('word.clock_prefix');
  const formatString = clockPrefix ? `do MMMM yyyy '${clockPrefix}' HH.mm` : `do MMMM yyyy HH.mm`;

  return (
    <div className={styles.inboxItemDetailWrapper}>
      <article className={styles.inboxItemDetail}>
        <header className={styles.header} data-id="dialog-header">
          <h1 className={styles.title}>{title}</h1>
        </header>
        <div className={styles.participants} data-id="dialog-sender-receiver">
          <Avatar
            name={sender?.name ?? ''}
            imageUrl={sender?.imageURL}
            profile={sender?.isCompany ? 'organization' : 'person'}
          />
          <div className={styles.senderInfo}>
            <div className={styles.sender}>{sender?.name}</div>
            <div className={styles.receiver}>
              {t('word.to')} {receiver?.name}
            </div>
          </div>
        </div>
        <div className={styles.sectionWithStatus} data-id="dialog-summary">
          <section className={styles.summarySection}>
            <time className={styles.updatedLabel} dateTime={updatedAt}>
              {format(updatedAt, formatString)}
            </time>
            <p className={styles.summary}>{summary}</p>
          </section>
          <MainContentReference args={mainContentReference} dialogToken={dialogToken} />
          <section data-id="dialog-attachments">
            {attachmentCount > 0 && (
              <h2 className={styles.attachmentTitle}>{t('inbox.heading.attachments', { count: attachmentCount })}</h2>
            )}
            <ul className={styles.attachments} data-id="dialog-attachments-list">
              {attachments.map((attachment) =>
                attachment.urls
                  .filter((url) => url.consumerType === AttachmentUrlConsumer.Gui)
                  .map((url) => (
                    <li key={url.id} className={styles.attachmentItem}>
                      <Link
                        href={url.url}
                        aria-label={t('inbox.attachment.link', {
                          label: url.url,
                        })}
                      >
                        <FileIcon className={styles.attachmentIcon} />
                        {getPropertyByCultureCode(attachment.displayName) || url.url}
                      </Link>
                    </li>
                  )),
              )}
            </ul>
          </section>
          {guiActions.length > 0 && <GuiActions actions={guiActions} dialogToken={dialogToken} />}
          <div className={styles.tags} data-id="dialog-meta-field-tags">
            {metaFields.map((tag) => (
              <div key={tag.label} className={styles.tag}>
                <div className={styles.tagIcon}>
                  <EyeIcon />
                </div>
                <span> {tag.label}</span>
              </div>
            ))}
          </div>
        </div>
        {additionalInfo && (
          <section className={styles.additionalInfo} data-id="dialog-additional-info">
            {additionalInfo}
          </section>
        )}
      </article>
      {activities.length > 0 && (
        <section data-id="dialog-activity-history" className={styles.activities}>
          <h3 className={styles.activitiesTitle}>{t('word.activities')}</h3>
          {activities.map((activity) => (
            <Activity key={activity.id} activity={activity} serviceOwner={sender} />
          ))}
        </section>
      )}
    </div>
  );
};
