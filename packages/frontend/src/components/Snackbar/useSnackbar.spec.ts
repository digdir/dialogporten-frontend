import { QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createCustomWrapper } from '../../../utils/test-utils.tsx';
import { SnackbarDuration, useSnackbar } from './useSnackbar';

const queryClient = new QueryClient();
const wrapper = createCustomWrapper(queryClient);

/* work-around for https://github.com/vitest-dev/vitest/issues/3117 */
(globalThis as unknown as { jest: typeof vi }).jest = vi;

describe('useSnackbar', () => {
  afterEach(() => {
    queryClient.clear();
  });

  it('useSnackbar hook returns correct initial state', async () => {
    const { result } = renderHook(() => useSnackbar(), { wrapper });

    expect(result.current.isOpen).toEqual(false);
    expect(result.current.storedMessages).toEqual([]);
  });

  it('useSnackbar hook updates state when opening snackbar', async () => {
    const { result } = renderHook(() => useSnackbar(), { wrapper });

    await waitFor(async () => {
      result.current.openSnackbar({ message: 'Test Message', variant: 'info' });
    });

    await waitFor(() => expect(result.current.isOpen).equals(true));
    expect(result.current.storedMessages.length).toBe(1);
  });

  it('useSnackbar hook closes snackbar correctly', async () => {
    const { result } = renderHook(() => useSnackbar(), { wrapper });

    const id = await waitFor(async () => {
      return result.current.openSnackbar({ message: 'hello', variant: 'success' });
    });

    await waitFor(() => result.current.closeSnackbarItem(id));
    await waitFor(() => expect(result.current.isOpen).equals(false));
    await waitFor(() => expect(result.current.storedMessages.length).equals(0));
  });

  it('useSnackbar hook dismisses all snackbar messages', async () => {
    const { result } = renderHook(() => useSnackbar(), { wrapper });

    await waitFor(async () => {
      result.current.openSnackbar({ message: 'Test Message 1', variant: 'info' });
      result.current.openSnackbar({ message: 'Test Message 2', variant: 'success' });
    });

    expect(result.current.isOpen).equals(true);
    expect(result.current.storedMessages.length).equals(2);

    await waitFor(async () => {
      result.current.dismissSnackbar();
    });

    expect(result.current.isOpen).toEqual(false);
    expect(result.current.storedMessages.length).toBe(0);
  });

  it('useSnackbar hook closes snackbar automatically after duration', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useSnackbar(), { wrapper });

    await waitFor(async () => {
      result.current.openSnackbar({ message: 'Test Message', variant: 'info', duration: SnackbarDuration.normal });
    });

    expect(result.current.isOpen).equals(true);

    vi.advanceTimersByTime(SnackbarDuration.normal);

    await waitFor(async () => expect(result.current.isOpen).equals(false));
    await waitFor(async () => expect(result.current.storedMessages.length).equals(0));

    vi.useRealTimers();
  });
});
