import { useQuery, useQueryClient } from 'react-query';
import { useCallback, useEffect, useRef } from 'react';

export enum SnackbarDuration {
  infinite = 0,
  short = 1000,
  normal = 3000,
  long = 5000,
}

export type SnackbarMessageVariant = 'success' | 'error' | 'info';

export interface SnackbarStoreRecord {
  id: string;
  message: string;
  variant: SnackbarMessageVariant;
  duration: number;
  dismissable: boolean;
}

interface SnackbarInput {
  message: string;
  variant: SnackbarMessageVariant;
  duration?: SnackbarDuration | number;
  dismissable?: boolean;
}

interface SnackbarOutput extends SnackbarConfig {
  openSnackbar: (input: SnackbarInput) => string;
  closeSnackbarItem: (id: string) => void;
  dismissSnackbar: () => void;
}

interface SnackbarConfig {
  isOpen: boolean;
  storedMessages: SnackbarStoreRecord[];
}

/**
 * Custom hook for managing snackbar messages.
 * @returns SnackbarOutput object containing functions and state related to snackbar.
 */
export function useSnackbar(): SnackbarOutput {
  const queryClient = useQueryClient();
  const closingTime = useRef<NodeJS.Timeout | null>(null);
  const queryKey = 'snackbarConfig';
  const defaultDuration = SnackbarDuration.normal;

  const initialData = {
    isOpen: false,
    storedMessages: [],
  };

  const { data } = useQuery<SnackbarConfig>([queryKey], () => initialData, {
    enabled: false,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const dismissSnackbar = () => {
    void queryClient.setQueryData<SnackbarConfig>([queryKey], () => initialData);
    if (closingTime?.current) {
      clearTimeout(closingTime.current);
    }
  };

  const openSnackbar = ({ message, variant, dismissable, duration }: SnackbarInput): string => {
    const id = btoa(String(Math.random())).substring(0, 12);
    queryClient.setQueryData<SnackbarConfig>([queryKey], (oldData) => {
      return {
        isOpen: true,
        storedMessages: [
          ...(oldData?.storedMessages ?? []),
          { id, variant, message, duration: duration ?? defaultDuration, dismissable: dismissable ?? true },
        ],
      };
    });
    return id;
  };

  const closeSnackbarItem = useCallback(
    (id: string) => {
      queryClient.setQueryData<SnackbarConfig>([queryKey], (oldData) => {
        const updatedStoredMessages = (oldData?.storedMessages ?? []).filter((item) => item.id !== id);
        const isOpen = updatedStoredMessages.length > 0;
        return {
          isOpen,
          storedMessages: updatedStoredMessages,
        };
      });
    },
    [queryClient],
  );

  useEffect(() => {
    const storedMessageItem = data?.storedMessages?.filter((item) => item.duration > 0)[0];
    if (typeof storedMessageItem !== 'undefined') {
      closingTime.current = setTimeout(() => {
        closeSnackbarItem(storedMessageItem?.id);
      }, storedMessageItem.duration);
    }

    return () => {
      if (closingTime?.current) {
        clearTimeout(closingTime.current);
      }
    };
  }, [data?.storedMessages, closeSnackbarItem]);

  return {
    isOpen: data?.isOpen ?? false,
    storedMessages: data?.storedMessages ?? [],
    closeSnackbarItem,
    dismissSnackbar,
    openSnackbar,
  };
}
