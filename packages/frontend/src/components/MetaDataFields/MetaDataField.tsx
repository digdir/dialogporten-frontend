import { ClockIcon, EyeIcon, PaperclipIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import type { InboxItemTag } from './MetaDataFields';
import styles from './metaDataFields.module.css';

export const MetaDataField = ({ tag }: { tag: InboxItemTag }) => {
  const getIconByType = (type: InboxItemTag['type']) => {
    switch (type) {
      case 'attachment':
        return <PaperclipIcon />;
      case 'timestamp':
        return <ClockIcon />;
      case 'seenBy':
        return <EyeIcon />;
      case 'status':
        return;
    }
  };
  const icon = getIconByType(tag.type);

  return (
    <div
      className={cx(styles.tag, { [styles.status]: tag.type === 'status' })}
      title={String(tag.options?.tooltip || '')}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <span>{tag.label}</span>
    </div>
  );
};
