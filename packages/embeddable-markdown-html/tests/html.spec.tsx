import { render, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Html } from '../src';
import '@testing-library/jest-dom';

describe('Html', () => {
  test('should render content', async () => {
    const { container, getByText } = render(<Html>{'<h1> header </h1>'}</Html>);

    await waitFor(() => {
      expect(getByText('header')).toBeInTheDocument();
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should not render script tags', async () => {
    const { container, getByText } = render(
      <Html>{'<div><script>A dangerous script!</script><h1> header </h1></div>'}</Html>,
    );

    await waitFor(() => {
      expect(getByText('header')).toBeInTheDocument();

      const scriptTags = container.querySelector('script');
      expect(scriptTags).not.toBeInTheDocument();
    });
  });
});
