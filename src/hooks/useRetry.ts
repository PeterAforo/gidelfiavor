import { useState, useCallback } from 'react';

interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoff?: boolean;
}

interface RetryState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  retryCount: number;
  retry: () => Promise<void>;
}

export function useRetry<T>(
  asyncFn: () => Promise<T>,
  options: RetryOptions = {}
): RetryState<T> {
  const { maxRetries = 3, delay = 1000, backoff = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await asyncFn();
        setData(result);
        setRetryCount(attempt);
        setIsLoading(false);
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        setRetryCount(attempt);
        
        if (attempt < maxRetries) {
          const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    setError(lastError);
    setIsLoading(false);
  }, [asyncFn, maxRetries, delay, backoff]);

  return {
    data,
    error,
    isLoading,
    retryCount,
    retry: execute,
  };
}

export function useAsyncAction<T, Args extends unknown[]>(
  asyncFn: (...args: Args) => Promise<T>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (...args: Args) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFn]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset,
  };
}

export default useRetry;
