import React from 'react';
import { useRouteError } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';

export const RouterErrorMessage = (): JSX.Element => {
  const error = useRouteError();
  return (
    <ErrorMessage title="Error" message="Something went wrong...">
      {(error as Error)?.message || (error as { statusText?: string })?.statusText}
    </ErrorMessage>
  );
};
