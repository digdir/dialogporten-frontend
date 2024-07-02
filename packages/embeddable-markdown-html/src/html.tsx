import { type ReactElement, useEffect, useState } from 'react';
import * as prod from 'react/jsx-runtime';
import rehypeParse, { type Options as RehypeParseOptions } from 'rehype-parse';
import rehypeReact from 'rehype-react';
import { unified } from 'unified';

// @ts-expect-error: the react types are missing.
const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

export const Html: React.FC<{
  children: string;
  onError?: (err: Error) => void;
}> = ({ children, onError = () => {} }) => {
  const [reactContent, setReactContent] = useState<ReactElement | null>(null);

  // TODO: Could this be a useMemo call?
  useEffect(() => {
    unified()
      .use(rehypeParse, {} as RehypeParseOptions)
      .use(rehypeReact, production)
      .process(children)
      .then((vfile) => setReactContent(vfile.result as ReactElement))
      .catch((e) => onError(e));
  }, [children, onError]);

  return reactContent;
};
