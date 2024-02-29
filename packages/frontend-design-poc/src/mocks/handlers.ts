import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/user', () => {
    return HttpResponse.json({ name: 'John Doe', scopes: [] });
  }),
];
