import { ClockIcon, EyeIcon, PaperclipIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import type { InboxItemMetaField } from './MetaDataFields';
import styles from './metaDataFields.module.css';

export const MetaDataField = ({ metaField }: { metaField: InboxItemMetaField }) => {
  const getIconByType = (type: InboxItemMetaField['type']): JSX.Element | null => {
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
  const icon = getIconByType(metaField.type);

  return (
    <div
      className={cx(styles.field, { [styles.status]: metaField.type === 'status' })}
      title={String(metaField.options?.tooltip || '')}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <span>{metaField.label}</span>
    </div>
  );
};
