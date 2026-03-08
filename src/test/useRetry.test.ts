import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRetry, useAsyncAction } from '../hooks/useRetry';

describe('useRetry', () => {
  it('should return initial state', () => {
    const asyncFn = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useRetry(asyncFn));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.retryCount).toBe(0);
  });

  it('should execute async function and return data', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useRetry(asyncFn));

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.data).toBe('success');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should retry on failure', async () => {
    const asyncFn = vi.fn()
      .mockRejectedValueOnce(new Error('First fail'))
      .mockRejectedValueOnce(new Error('Second fail'))
      .mockResolvedValue('success');

    const { result } = renderHook(() => 
      useRetry(asyncFn, { maxRetries: 3, delay: 10, backoff: false })
    );

    await act(async () => {
      await result.current.retry();
    });

    expect(asyncFn).toHaveBeenCalledTimes(3);
    expect(result.current.data).toBe('success');
    expect(result.current.retryCount).toBe(2);
  });

  it('should return error after max retries', async () => {
    const asyncFn = vi.fn().mockRejectedValue(new Error('Always fails'));

    const { result } = renderHook(() => 
      useRetry(asyncFn, { maxRetries: 2, delay: 10, backoff: false })
    );

    await act(async () => {
      await result.current.retry();
    });

    expect(asyncFn).toHaveBeenCalledTimes(3); // initial + 2 retries
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Always fails');
  });
});

describe('useAsyncAction', () => {
  it('should execute action and return data', async () => {
    const asyncFn = vi.fn().mockResolvedValue({ id: 1 });
    const { result } = renderHook(() => useAsyncAction(asyncFn));

    let returnValue;
    await act(async () => {
      returnValue = await result.current.execute('arg1', 'arg2');
    });

    expect(asyncFn).toHaveBeenCalledWith('arg1', 'arg2');
    expect(returnValue).toEqual({ id: 1 });
    expect(result.current.data).toEqual({ id: 1 });
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle errors', async () => {
    const asyncFn = vi.fn().mockRejectedValue(new Error('Action failed'));
    const { result } = renderHook(() => useAsyncAction(asyncFn));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // Expected
      }
    });

    expect(result.current.error?.message).toBe('Action failed');
    expect(result.current.isLoading).toBe(false);
  });

  it('should reset state', async () => {
    const asyncFn = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsyncAction(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe('data');

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
