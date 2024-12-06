import { beforeAll, describe, expect, it } from 'vitest';
import { customRender } from '../utils/test-utils.tsx';
import App from './App.tsx';
import { server } from './mocks/node.ts';

describe('App Smoke Test', async () => {
  beforeAll(async () => {
    server.listen();
  });

  it.skip('renders without crashing', () => {
    const { getByRole } = customRender(<App />);
    const appElement = getByRole('main');
    expect(appElement).toBeTruthy();
  });
});
