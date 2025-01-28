import { render, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Markdown } from '../src';

describe('Markdown', () => {
  test('should render content', async () => {
    const { container, getByText } = render(<Markdown onError={() => {}}># header</Markdown>);
    await waitFor(() => {
      expect(getByText('header')).toBeInTheDocument();
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render hard line breaks, 1', async () => {
    const markdownString = `foo  \rbaz`;
    const { container } = render(<Markdown onError={() => {}}>{markdownString}</Markdown>);

    await waitFor(() => {
      expect(container).toHaveTextContent('foo');
      expect(container).toHaveTextContent('baz');
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render hard line breaks, 2', async () => {
    const markdownString = `This is the first line.  
This is the second line.`;
    const { container } = render(<Markdown onError={() => {}}>{markdownString}</Markdown>);

    await waitFor(() => {
      expect(container).toHaveTextContent('This is the first line');
      expect(container).toHaveTextContent('This is the second line');
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('list items', async () => {
    const markdownString = '1.  A paragraph\n    with two lines.\n\n        indented code\n\n    > A block quote.\n';
    const { container } = render(<Markdown onError={() => {}}>{markdownString}</Markdown>);
    await waitFor(() => {
      expect(container).toHaveTextContent('A paragraph with two lines.');
      expect(container).toHaveTextContent('indented code');
      expect(container).toHaveTextContent('A block quote.');
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render link', async () => {
    const markdownString = '[foo]: /url "title"\n\n[foo]\n';
    const { container } = render(<Markdown onError={() => {}}>{markdownString}</Markdown>);
    await waitFor(() => {
      expect(container).toHaveTextContent('foo');
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render emphasis and strong emphasis', async () => {
    const markdownString = '**foo**  *bar*';
    const { container } = render(<Markdown onError={() => {}}>{markdownString}</Markdown>);
    await waitFor(() => {
      expect(container).toHaveTextContent('foo');
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
