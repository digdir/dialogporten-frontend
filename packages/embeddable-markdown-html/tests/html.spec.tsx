import { render, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Html } from '../src';

describe('Html', () => {
  test('should render content', async () => {
    const { container, getByText } = render(<Html>{'<h1> header </h1>'}</Html>);

    await waitFor(() => {
      (expect(getByText('header')) as any).toBeInTheDocument();
    });

    expect(container.firstChild).toMatchSnapshot();
  });
});
