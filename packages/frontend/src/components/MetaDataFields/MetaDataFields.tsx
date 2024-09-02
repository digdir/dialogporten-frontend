import { MetaDataField } from './MetaDataField.tsx';
import styles from './metaDataFields.module.css';

export type InboxItemMetaFieldType = 'attachment' | 'status' | 'timestamp' | 'seenBy';
export interface InboxItemMetaField {
  type: InboxItemMetaFieldType;
  label: string;
  options?: {
    [propKey: string]: string | number | boolean;
  };
}

export const MetaDataFields = ({ metaFields }: { metaFields: InboxItemMetaField[] }) => {
  return (
    <div className={styles.fields}>
      {metaFields.map((metaField, index) => (
        <MetaDataField key={`metaField-${index}`} metaField={metaField} />
      ))}
    </div>
  );
};
