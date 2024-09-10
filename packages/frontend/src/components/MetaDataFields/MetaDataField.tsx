import cx from 'classnames';
import type { InboxItemMetaField } from './MetaDataFields';
import styles from './metaDataFields.module.css';

interface MetaDataFieldProps {
  metaField?: InboxItemMetaField;
  className?: string;
  children?: React.ReactNode;
}

export const MetaDataField = ({ metaField, className, children }: MetaDataFieldProps) => {
  return (
    <div className={cx(styles.field, className)} title={String(metaField?.options?.tooltip || '')}>
      {children}
    </div>
  );
};
