import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App.tsx';

describe('App Smoke Test', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<App />);
    const appElement = getByTestId('app');
    expect(appElement).toBeTruthy();
  });
});
