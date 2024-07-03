import { render, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Markdown } from '../src';

describe('Markdown', () => {
  test('should render content', async () => {
    const { container, getByText } = render(<Markdown># header</Markdown>);

    await waitFor(() => {
      expect(getByText('header')).toBeInTheDocument();
    });

    expect(container.firstChild).toMatchSnapshot();
  });
});
