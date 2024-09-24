import type { Options as RemarkRehypeOptions } from 'mdast-util-to-hast';
import { type ReactElement, useEffect, useState } from 'react';
import * as prod from 'react/jsx-runtime';
import addClasses from 'rehype-class-names';
import rehypeReact from 'rehype-react';
import rehypeSanitize from 'rehype-sanitize';
import remarkParse, { type Options as RemarkParseOptions } from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import { unified } from 'unified';

import './markdown.css';

type ClassMap = Partial<Record<string, string>>;
// @ts-expect-error: the react types are missing.
const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

const defaultClassMap: ClassMap = {
  p: '__markdown-paragraph',
  li: '__markdown-list-item',
  h1: '__markdown-header-1',
  h2: '__markdown-header-2',
  h3: '__markdown-header-3',
  h4: '__markdown-header-4',
  h5: '__markdown-header-5',
  h6: '__markdown-header-6',
  strong: '__markdown-strong',
};

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
  classMap,
}: { children: string; onError?: (error: unknown) => void; classMap?: ClassMap }) => ReactElement | null = ({
  children,
  onError = () => {},
  classMap = defaultClassMap,
}) => {
  const [reactContent, setReactContent] = useState<ReactElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    unified()
      .use(remarkParse, {} as RemarkParseOptions)
      .use(remarkToRehype, {} as RemarkRehypeOptions)
      .use(rehypeSanitize)
      .use(addClasses, classMap)
      .use(rehypeReact, production)
      .process(children)
      .then((vfile) => setReactContent(vfile.result as ReactElement))
      .catch(onError);
  }, [children]);

  return reactContent;
};
