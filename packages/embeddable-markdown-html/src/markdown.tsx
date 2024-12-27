import type { Options as RemarkRehypeOptions } from 'mdast-util-to-hast';
import { type ReactElement, useEffect, useState } from 'react';
import * as prod from 'react/jsx-runtime';
import addClasses from 'rehype-class-names';
import rehypeReact from 'rehype-react';
import rehypeSanitize from 'rehype-sanitize';
import remarkParse, { type Options as RemarkParseOptions } from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import { unified } from 'unified';
import { defaultClassMap } from './classMap.ts';

import './styles.css';

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

/**
 * Renders markdown as React elements.
 *
 * @param children - The markdown string to render.
 * @param onError - A callback for handling errors.
 * @param classMap - A map of HTML element names to CSS classes.
 * @returns The rendered React elements.
 */
export const Markdown: ({
  children,
  onError,
}: { children: string; onError: (error: unknown) => void }) => ReactElement | null = ({ children, onError }) => {
  const [reactContent, setReactContent] = useState<ReactElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    unified()
      .use(remarkParse, {} as RemarkParseOptions)
      .use(remarkToRehype, {} as RemarkRehypeOptions)
      .use(rehypeSanitize)
      .use(addClasses, defaultClassMap)
      .use(rehypeReact, production)
      .process(children)
      .then((vfile: { result: ReactElement }) => setReactContent(vfile.result))
      .catch(onError);
  }, [children]);

  return reactContent;
};
