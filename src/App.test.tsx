import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

test('renders Hello World text', () => {
  render(<App title='Hello World' />);
  const linkElement = screen.getByRole('heading', {
    name: 'Hello World',
    level: 1,
  });
  expect(linkElement).toBeInTheDocument();
});

test('clicking button executes onClick function', async () => {
  const onClickMock = jest.fn();
  render(<App title='Hello World' onClick={onClickMock} />);
  await userEvent.click(screen.getByRole('button', { name: 'Send inn' }));
  expect(onClickMock).toHaveBeenCalled();
  screen.getByLabelText('Hallo');
});
