import { toast } from 'sonner';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

export class ApiException extends Error {
  code?: string;
  status?: number;
  details?: Record<string, unknown>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiException';
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
  }
}

export const parseApiError = (error: unknown): ApiError => {
  if (error instanceof ApiException) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  return { message: 'An unexpected error occurred' };
};

export const getErrorMessage = (error: unknown): string => {
  const apiError = parseApiError(error);
  
  // Handle specific error codes
  switch (apiError.code) {
    case 'NETWORK_ERROR':
      return 'Unable to connect to the server. Please check your internet connection.';
    case 'UNAUTHORIZED':
      return 'Your session has expired. Please log in again.';
    case 'FORBIDDEN':
      return 'You do not have permission to perform this action.';
    case 'NOT_FOUND':
      return 'The requested resource was not found.';
    case 'VALIDATION_ERROR':
      return apiError.message || 'Please check your input and try again.';
    case 'RATE_LIMITED':
      return 'Too many requests. Please wait a moment and try again.';
    case 'SERVER_ERROR':
      return 'A server error occurred. Please try again later.';
    default:
      return apiError.message;
  }
};

export const handleApiError = (error: unknown, showToast = true): ApiError => {
  const apiError = parseApiError(error);
  const message = getErrorMessage(error);

  if (showToast) {
    toast.error(message);
  }

  // Log error for debugging
  console.error('API Error:', {
    ...apiError,
    displayMessage: message,
  });

  return { ...apiError, message };
};

export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  options: { showToast?: boolean; fallback?: T } = {}
): Promise<T> => {
  const { showToast = true, fallback } = options;

  try {
    return await fn();
  } catch (error) {
    handleApiError(error, showToast);
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
};

export const createApiClient = (baseUrl: string) => {
  const request = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const url = `${baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiException({
          message: errorData.message || errorData.error || `HTTP ${response.status}`,
          code: errorData.code || getCodeFromStatus(response.status),
          status: response.status,
          details: errorData,
        });
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiException({
          message: 'Network error',
          code: 'NETWORK_ERROR',
        });
      }

      throw new ApiException({
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'UNKNOWN_ERROR',
      });
    }
  };

  return {
    get: <T>(endpoint: string, options?: RequestInit) =>
      request<T>(endpoint, { ...options, method: 'GET' }),
    post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
      request<T>(endpoint, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),
    put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
      request<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),
    delete: <T>(endpoint: string, options?: RequestInit) =>
      request<T>(endpoint, { ...options, method: 'DELETE' }),
  };
};

const getCodeFromStatus = (status: number): string => {
  switch (status) {
    case 400:
      return 'VALIDATION_ERROR';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 429:
      return 'RATE_LIMITED';
    case 500:
    case 502:
    case 503:
      return 'SERVER_ERROR';
    default:
      return 'HTTP_ERROR';
  }
};

export default {
  ApiException,
  parseApiError,
  getErrorMessage,
  handleApiError,
  withErrorHandling,
  createApiClient,
};
