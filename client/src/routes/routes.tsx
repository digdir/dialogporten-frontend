import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PageLayout } from './PageLayout/PageLayout';
import { RouterErrorMessage } from './RouterErrorMessage';
import { TestPage } from './TestPage/TestPage';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    errorElement: <RouterErrorMessage />,
  },
  {
    path: '/test',
    element: <TestPage />,
  },
]);
