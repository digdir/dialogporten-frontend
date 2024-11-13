import { Html, Markdown } from 'embeddable-markdown-html';
import { memo } from 'react';
import styles from '../InboxItem/inboxItemDetail.module.css';

interface AdditionalInfoContentProps {
  mediaType: string | undefined;
  value: string | undefined;
}

export const AdditionalInfoContent = memo(({ mediaType, value }: AdditionalInfoContentProps) => {
  if (!value) {
    return null;
  }

  const getContent = (mediaType: string) => {
    switch (mediaType) {
      case 'text/html':
        return <Html onError={(e) => console.error('Html error: ', e)}>{value}</Html>;
      case 'text/markdown':
        return <Markdown onError={(e) => console.error('Markdown error: ', e)}>{value}</Markdown>;
      case 'text/plain':
        return value;
      default:
        return value;
    }
  };

  return (
    <section className={styles.additionalInfo} data-id="dialog-additional-info">
      {getContent(mediaType ?? 'text/plain')}
    </section>
  );
});
