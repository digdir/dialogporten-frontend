import { CheckmarkCircleFillIcon, EyeIcon, PaperclipIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { t } from 'i18next';
import type { InboxViewType } from '../../api/useDialogs.tsx';
import { useFormat } from '../../i18n/useDateFnsLocale.tsx';
import { LoadingCircle } from '../LoadingCircle/LoadingCircle.tsx';
import { MetaDataField } from './MetaDataField.tsx';
import styles from './metaDataFields.module.css';

export type InboxItemMetaFieldType =
  | 'attachment'
  | 'status_NEW'
  | 'status_DRAFT'
  | 'status_IN_PROGRESS'
  | 'status_SENT'
  | 'status_REQUIRES_ATTENTION'
  | 'status_COMPLETED'
  | 'timestamp'
  | 'seenBy';
export interface InboxItemMetaField {
  type: InboxItemMetaFieldType;
  label: string;
  viewType?: InboxViewType;
  options?: {
    [propKey: string]: string | number;
  };
}

interface MetaDataFieldsProps {
  metaFields: InboxItemMetaField[];
  viewType?: InboxViewType;
}

export const MetaDataFields = ({ metaFields }: MetaDataFieldsProps) => {
  const format = useFormat();
  const getIconByType = (type?: InboxItemMetaField['type']): JSX.Element | null => {
    switch (type) {
      case 'attachment':
        return <PaperclipIcon />;
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
        const metaFieldType = metaField.type as InboxItemMetaFieldType;
        if (metaFieldType === 'status_NEW') {
          return null;
        }
        switch (metaFieldType) {
          case 'status_IN_PROGRESS':
            return (
              <MetaDataField key={`metaField-${index}`} className={cx(styles.statusSolidBorder, styles.blueBorder)}>
                <div className={styles.icon}>
                  <LoadingCircle percentage={75} />
                </div>
                <span className={styles.label}>{t('status.in_progress')}</span>
              </MetaDataField>
            );
          case 'status_SENT':
            return (
              <MetaDataField key={`metaField-${index}`} className={styles.statusSolidBorder}>
                <span className={styles.label}>{t('route.sent')}</span>
              </MetaDataField>
            );
          case 'status_COMPLETED':
            return (
              <MetaDataField key={`metaField-${index}`} className={cx(styles.statusSolidBorder, styles.blueText)}>
                <div className={styles.icon}>
                  <CheckmarkCircleFillIcon fontSize="16px" />
                </div>
                <span className={styles.label}>{t('status.completed')}</span>
              </MetaDataField>
            );
          case 'status_REQUIRES_ATTENTION':
            return (
              <MetaDataField key={`metaField-${index}`} className={cx(styles.statusSolidBorder, styles.blueBackground)}>
                <span className={cx(styles.label, styles.requiresAttention)}>{t('status.requires_attention')}</span>
              </MetaDataField>
            );
          case 'status_DRAFT':
            return (
              <MetaDataField key={`metaField-${index}`} className={cx(styles.statusSolidBorder)}>
                <span className={styles.label}>{t('status.draft')}</span>
              </MetaDataField>
            );
          case 'timestamp': {
            const clockPrefix = t('word.clock_prefix');
            const formatString = clockPrefix ? `do MMMM yyyy '${clockPrefix}' HH.mm` : `do MMMM yyyy HH.mm`;
            return (
              <MetaDataField key={`metaField-${index}`}>
                <span className={styles.label}>{format(metaField.label, formatString)}</span>
              </MetaDataField>
            );
          }
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
