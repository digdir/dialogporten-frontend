import { http, HttpResponse } from 'msw';
import { dialogs as mockedDialogs } from './dialogs.tsx';

export const handlers = [
  http.get('/user', () => {
    return HttpResponse.json({ name: 'John Doe', scopes: [] });
  }),
  http.get('/dialogs', () => {
    return HttpResponse.json(mockedDialogs);
  }),
];
