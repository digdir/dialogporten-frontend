import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

export const useDialogByIdSubscription = (dialogId: string | undefined) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!dialogId) return;

    const eventSource = new EventSource(`/api/graphql/stream?dialogId=${dialogId}`, { withCredentials: true });
    const onError = (err: Event) => {
      console.error('EventSource error:', err);
    };

    const onNext = () => {
      /* TODO: check type from JSON.parse(event.data).data.dialogUpdated from event: MessageEvent to determine if we should
        invalidate the query for refetch or redirect to inbox if the dialog has been deleted;
       */
      void queryClient.invalidateQueries('dialogById');
    };

    eventSource.addEventListener('next', onNext);
    eventSource.addEventListener('error', onError);

    return () => {
      eventSource.removeEventListener('next', onNext);
      eventSource.removeEventListener('error', onError);
      eventSource.close();
    };
  }, [dialogId, queryClient]);
};
