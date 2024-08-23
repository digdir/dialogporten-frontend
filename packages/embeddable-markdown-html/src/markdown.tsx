import type { Options as RemarkRehypeOptions } from 'mdast-util-to-hast';
import { type ReactElement, useEffect, useState } from 'react';
import * as prod from 'react/jsx-runtime';
import rehypeReact from 'rehype-react';
import rehypeSanitize from 'rehype-sanitize';
import remarkParse, { type Options as RemarkParseOptions } from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import { unified } from 'unified';

// @ts-expect-error: the react types are missing.
const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

export const Markdown: ({
  children,
  onError,
}: { children: string; onError?: (error: unknown) => void }) => ReactElement | null = ({
  children,
  onError = () => {},
}) => {
  const [reactContent, setReactContent] = useState<ReactElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    unified()
      .use(remarkParse, {} as RemarkParseOptions)
      .use(remarkToRehype, {} as RemarkRehypeOptions)
      .use(rehypeSanitize)
      .use(rehypeReact, production)
      .process(children)
      .then((vfile) => setReactContent(vfile.result as ReactElement))
      .catch(onError);
  }, [children]);

  return reactContent;
};
