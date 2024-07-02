import type { Options as RemarkRehypeOptions } from 'mdast-util-to-hast';
import { type ReactElement, useEffect, useState } from 'react';
import * as prod from 'react/jsx-runtime';
import rehypeReact from 'rehype-react';
import remarkParse, { type Options as RemarkParseOptions } from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import { unified } from 'unified';

// @ts-expect-error: the react types are missing.
const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

export const Markdown: React.FC<{
  children: string;
  onError?: (err: Error) => void;
}> = ({ children, onError = () => {} }) => {
  const [reactContent, setReactContent] = useState<ReactElement | null>(null);

  // TODO: Could this be a useMemo call?
  useEffect(() => {
    unified()
      .use(remarkParse, {} as RemarkParseOptions)
      .use(remarkToRehype, {} as RemarkRehypeOptions)
      .use(rehypeReact, production)
      .process(children)
      .then((vfile) => setReactContent(vfile.result as ReactElement))
      .catch((e) => onError(e));
  }, [children, onError]);

  return reactContent;
};
