import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

export const useDialogByIdSubscription = (dialogId: string | undefined) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!dialogId) return;

    const eventSource = new EventSource(`/api/graphql/stream?dialogId=${dialogId}`, { withCredentials: true });

    eventSource.addEventListener('next', () => {
      void queryClient.invalidateQueries('dialogById');
    });

    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
    };

    return () => {
      eventSource.close();
    };
  }, [dialogId, queryClient]);
};
