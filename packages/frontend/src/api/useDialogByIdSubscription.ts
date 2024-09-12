import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { graphqlSSEClient } from './queries.ts';

export const useDialogByIdSubscription = (dialogId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubcribe = graphqlSSEClient.subscribe(
      {
        query: `
          subscription sub {
           dialogUpdated(dialogId: "0191dbd8-768d-7486-ad7b-bec7480783f3") {
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
      return unsubcribe();
    };
  }, []);
};

// Code below works, but it's not the correct solution and onmessge is not triggered

/*import { useEffect } from 'react';

export const useDialogByIdSubscription = (dialogId: string | undefined) => {
  useEffect(() => {
    if (!dialogId) return;

    const eventSource = new EventSource('/api/graphql/test', { withCredentials: true });

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received data:', data);
    };

    eventSource.onopen = () => {
      console.log('EventSource connection opened.');
    }

    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
    };

    return () => {
      eventSource.close();
    };
  }, [dialogId]);
};


/*

`
          subscription sub($dialogId: UUID!) {
           dialogUpdated(dialogId: "0191dbd8-768d-7486-ad7b-bec7480783f3") {
             id
           }
          }`
 */
