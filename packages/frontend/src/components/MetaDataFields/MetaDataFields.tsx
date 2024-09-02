import { MetaDataField } from './MetaDataField.tsx';
import styles from './metaDataFields.module.css';

export interface InboxItemTag {
  type: 'attachment' | 'status' | 'timestamp' | 'seenBy';
  label: string;
  options?: {
    [propKey: string]: string | number | boolean;
  };
}

export const MetaDataFields = ({ tags }: { tags: InboxItemTag[] }) => {
  return (
    <div className={styles.tags}>
      {tags.map((tag, index) => (
        <MetaDataField key={`tag-${index}`} tag={tag} />
      ))}
    </div>
  );
};
