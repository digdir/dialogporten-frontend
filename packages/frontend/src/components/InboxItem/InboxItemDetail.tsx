import { Link } from '@digdir/designsystemet-react';
import { FileIcon } from '@navikt/aksel-icons';
import { ElementUrlConsumer } from 'bff-types-generated';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { DialogByIdDetails, getPropertyByCultureCode } from '../../api/useDialogById.tsx';
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
  dialog: { title, description, sender, receiver, toLabel, guiActions, tags = [], additionalInfo, activities },
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
        <h2>{t('inbox.heading.events', { count: activities.length })}</h2>
        {activities
          .slice()
          .reverse()
          .map((activity) => {
            /* cf. https://github.com/digdir/dialogporten/issues/760 for performedBy */
            const attachmentCount = activity.elements.reduce((tail, element) => tail + element.urls.length, 0);
            return (
              <section key={activity.id}>
                <span>{getPropertyByCultureCode(activity.performedBy)}</span>
                <div className={styles.elements}>
                  <h2 id="attachmentTitle" className={styles.attachmentTitle}>
                    {t('inbox.attachment.count', {
                      count: attachmentCount,
                    })}
                  </h2>
                  {activity.elements.map((element) => {
                    return (
                      <div key={element.id}>
                        {element.urls.length > 0 && (
                          <div className={styles.attachments} aria-labelledby="attachmentTitle">
                            <ul className={styles.attachmentItem}>
                              {element.urls
                                /* Urls per element are same content in formats */
                                .filter((url) => url.consumerType === ElementUrlConsumer.Gui)
                                .map((url) => (
                                  <li key={url.id}>
                                    {/* TODO: Icon should render differently depending on url.mimeType */}
                                    <FileIcon />
                                    <Link
                                      href={url.url}
                                      aria-label={t('inbox.attachment.link', {
                                        label: url.url,
                                      })}
                                    >
                                      {getPropertyByCultureCode(element.displayName) || url.url}
                                    </Link>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <span>{format(activity.createdAt, 'P', { locale: nb })}</span>
                </div>
              </section>
            );
          })}
      </section>
      {additionalInfo && <section className={styles.additionalInfo}>{additionalInfo}</section>}
    </section>
  );
};
