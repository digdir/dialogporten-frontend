import { CheckmarkCircleFillIcon, CircleIcon, ClockIcon, EyeIcon, PaperclipIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { t } from 'i18next';
import type { InboxViewType } from '../../api/useDialogs.tsx';
import { MetaDataField } from './MetaDataField.tsx';
import styles from './metaDataFields.module.css';

export type InboxItemMetaFieldType =
  | 'attachment'
  | 'status_new'
  | 'status_draft'
  | 'status_inprogress'
  | 'status_sent'
  | 'status_requires_attention'
  | 'status_completed'
  | 'timestamp'
  | 'viewType'
  | 'seenBy';
export interface InboxItemMetaField {
  type: InboxItemMetaFieldType;
  label: string;
  viewType?: InboxViewType;
  options?: {
    [propKey: string]: string | number | boolean;
  };
}

interface MetaDataFieldsProps {
  metaFields: InboxItemMetaField[];
  viewType?: InboxViewType;
}

export const MetaDataFields = ({ metaFields, viewType }: MetaDataFieldsProps) => {
  const getIconByType = (type?: InboxItemMetaField['type']): JSX.Element | null => {
    switch (type) {
      case 'attachment':
        return <PaperclipIcon />;
      case 'timestamp':
        return <ClockIcon />;
      case 'seenBy':
        return <EyeIcon />;
      default:
        return null;
    }
  };
  return (
    <div className={styles.fields}>
      {metaFields.map((metaField, index) => {
        const icon = getIconByType(metaField?.type);
        const metaFieldType = metaField.type.toLowerCase() as InboxItemMetaFieldType;
        if (viewType === 'inbox' && metaFieldType === 'status_new') {
          return null;
        }
        switch (metaFieldType) {
          case 'status_inprogress':
            return (
              <MetaDataField key={`metaField-${index}`} classNames={cx(styles.statusSolidBorder, styles.blueBorder)}>
                <div className={styles.icon}>
                  <CircleIcon fontSize="16px" />
                </div>
                <span className={styles.label}>{t('status.in_progress')}</span>
              </MetaDataField>
            );
          case 'status_sent':
            return (
              <MetaDataField key={`metaField-${index}`} classNames={styles.statusSolidBorder}>
                <span className={styles.label}>{t('route.sent')}</span>
              </MetaDataField>
            );
          case 'status_completed':
            return (
              <MetaDataField key={`metaField-${index}`} classNames={cx(styles.statusSolidBorder, styles.blueText)}>
                <div className={styles.icon}>
                  <CheckmarkCircleFillIcon fontSize="16px" />
                </div>
                <span className={styles.label}>{t('status.completed')}</span>
              </MetaDataField>
            );
          case 'status_requires_attention':
            return (
              <MetaDataField
                key={`metaField-${index}`}
                classNames={cx(styles.statusSolidBorder, styles.blueBackground)}
              >
                <span className={styles.label}>{t('status.requires_attention')}</span>
              </MetaDataField>
            );
          case 'status_draft':
            return (
              <MetaDataField key={`metaField-${index}`} classNames={cx(styles.statusSolidBorder)}>
                <span className={styles.label}>{t('status.draft')}</span>
              </MetaDataField>
            );
          case 'timestamp':
            return (
              <MetaDataField key={`metaField-${index}`}>
                {icon && <div className={styles.icon}>{icon}</div>}
                <span className={styles.label}>{metaField.label}</span>
              </MetaDataField>
            );
          default:
            return (
              <MetaDataField key={`metaField-${index}`}>
                {icon && <div className={styles.icon}>{icon}</div>}
                <span className={styles.label}>{metaField.label}</span>
              </MetaDataField>
            );
        }
      })}
    </div>
  );
};
