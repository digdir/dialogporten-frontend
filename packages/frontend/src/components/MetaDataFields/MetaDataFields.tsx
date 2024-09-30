import { t } from 'i18next';
import type { InboxViewType } from '../../api/useDialogs.tsx';
import { useFormat } from '../../i18n/useDateFnsLocale.tsx';
import { MetaField, StatusField } from './';
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
  return (
    <div className={styles.fields}>
      {metaFields.map((metaField) => {
        const metaFieldType = metaField.type as InboxItemMetaFieldType;
        if (metaFieldType === 'status_NEW') {
          return null;
        }
        switch (metaFieldType) {
          case 'status_IN_PROGRESS':
            return (
              <StatusField key={`metaField-${metaFieldType}`} status={metaFieldType} label={t('status.in_progress')} />
            );
          case 'status_SENT':
            return <StatusField key={`metaField-${metaFieldType}`} status={metaFieldType} label={t('route.sent')} />;
          case 'status_COMPLETED':
            return (
              <StatusField key={`metaField-${metaFieldType}`} status={metaFieldType} label={t('status.completed')} />
            );
          case 'status_REQUIRES_ATTENTION':
            return (
              <StatusField
                key={`metaField-${metaFieldType}`}
                status={metaFieldType}
                label={t('status.requires_attention')}
              />
            );

          case 'status_DRAFT':
            return <StatusField key={`metaField-${metaFieldType}`} status={metaFieldType} label={t('status.draft')} />;
          case 'timestamp': {
            const clockPrefix = t('word.clock_prefix');
            const formatString = clockPrefix ? `do MMMM yyyy '${clockPrefix}' HH.mm` : `do MMMM yyyy HH.mm`;
            return (
              <MetaField
                key={`metaField-${metaFieldType}`}
                label={format(metaField.label, formatString)}
                toolTip={String(metaField?.options?.tooltip || '')}
                type={metaFieldType}
              />
            );
          }
          default:
            return (
              <MetaField
                key={`metaField-${metaFieldType}`}
                label={metaField.label}
                toolTip={String(metaField?.options?.tooltip || '')}
                type={metaFieldType}
              />
            );
        }
      })}
    </div>
  );
};
