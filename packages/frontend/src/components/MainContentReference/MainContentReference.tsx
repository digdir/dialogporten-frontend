import { useQuery } from '@tanstack/react-query';
import { Markdown } from 'embeddable-markdown-html';
import type { DialogByIdDetails } from '../../api/useDialogById.tsx';
import { QUERY_KEYS } from '../../constants/queryKeys.ts';
import styles from './mainContentReference.module.css';

export const MainContentReference = ({
  args,
  dialogToken,
}: { args: DialogByIdDetails['mainContentReference']; dialogToken: string }) => {
  const { data, isSuccess, error } = useQuery({
    queryKey: [QUERY_KEYS.MAIN_CONTENT_REFERENCE, args?.url],
    queryFn: () =>
      fetch(args!.url, {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${dialogToken}`,
        },
      }).then((res) => res.text()),
    enabled: args?.url !== undefined && args?.mediaType === 'markdown',
  });

  if (!args) {
    return null;
  }

  if (typeof error === 'string') {
    return <div data-id="dialog-main-content-reference-error">Error parsing 'mainContentReference': {error}</div>;
  }

  if (typeof data === 'string' && isSuccess) {
    return (
      <section data-id="dialog-main-content-reference" className={styles.mainContentReference}>
        <Markdown>{data}</Markdown>
      </section>
    );
  }

  return null;
};
