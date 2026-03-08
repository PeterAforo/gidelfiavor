import { describe, it, expect } from 'vitest';
import {
  ApiException,
  parseApiError,
  getErrorMessage,
} from '../lib/apiErrorHandler';

describe('apiErrorHandler', () => {
  describe('ApiException', () => {
    it('should create an exception with all properties', () => {
      const error = new ApiException({
        message: 'Test error',
        code: 'TEST_ERROR',
        status: 400,
        details: { field: 'test' },
      });

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.status).toBe(400);
      expect(error.details).toEqual({ field: 'test' });
      expect(error.name).toBe('ApiException');
    });
  });

  describe('parseApiError', () => {
    it('should parse ApiException', () => {
      const exception = new ApiException({
        message: 'API error',
        code: 'API_ERROR',
        status: 500,
      });

      const result = parseApiError(exception);

      expect(result.message).toBe('API error');
      expect(result.code).toBe('API_ERROR');
      expect(result.status).toBe(500);
    });

    it('should parse Error', () => {
      const error = new Error('Standard error');

      const result = parseApiError(error);

      expect(result.message).toBe('Standard error');
    });

    it('should parse string', () => {
      const result = parseApiError('String error');

      expect(result.message).toBe('String error');
    });

    it('should handle unknown types', () => {
      const result = parseApiError({ random: 'object' });

      expect(result.message).toBe('An unexpected error occurred');
    });
  });

  describe('getErrorMessage', () => {
    it('should return network error message', () => {
      const error = new ApiException({
        message: 'Network failed',
        code: 'NETWORK_ERROR',
      });

      const message = getErrorMessage(error);

      expect(message).toContain('internet connection');
    });

    it('should return unauthorized message', () => {
      const error = new ApiException({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });

      const message = getErrorMessage(error);

      expect(message).toContain('session has expired');
    });

    it('should return rate limited message', () => {
      const error = new ApiException({
        message: 'Rate limited',
        code: 'RATE_LIMITED',
      });

      const message = getErrorMessage(error);

      expect(message).toContain('Too many requests');
    });

    it('should return original message for unknown codes', () => {
      const error = new ApiException({
        message: 'Custom error message',
        code: 'CUSTOM_CODE',
      });

      const message = getErrorMessage(error);

      expect(message).toBe('Custom error message');
    });
  });
});
