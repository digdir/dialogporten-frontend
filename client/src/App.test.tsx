import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders PageLayout text', () => {
  render(<App />);
  const linkElement = screen.getByRole('heading', {
    name: 'PageLayout',
    level: 1,
  });
  expect(linkElement).toBeInTheDocument();
});
