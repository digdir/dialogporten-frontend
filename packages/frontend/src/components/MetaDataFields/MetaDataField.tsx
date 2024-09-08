import cx from 'classnames';
import type { InboxItemMetaField } from './MetaDataFields';
import styles from './metaDataFields.module.css';

interface MetaDataFieldProps {
  metaField?: InboxItemMetaField;
  classNames?: string;
  children?: React.ReactNode;
}
export const MetaDataField = ({ metaField, classNames, children }: MetaDataFieldProps) => {
  return (
    <div className={cx(styles.field, classNames)} title={String(metaField?.options?.tooltip || '')}>
      {children}
    </div>
  );
};
