import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { graphqlSSEClient } from './queries.ts';

export const useDialogByIdSubscription = (dialogId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = graphqlSSEClient.subscribe(
      {
        query: `
          subscription sub {
           dialogUpdated(dialogId: "${dialogId}") {
             id
           }
          }`,
      },
      {
        next: (data) => {
          console.log('Received data:', data);
          void queryClient.invalidateQueries('dialogById');
        },
        error: (err) => {
          console.error('Error:', err);
        },
        complete: () => {
          console.log('Subscription complete');
        },
      },
    );
    return () => {
      return subscription();
    };
  }, []);
};
