import { describe, it, expect } from 'vitest';
import { apiSuccess, apiError, getErrorMessage } from './api-response';

describe('API Response Utilities', () => {
  describe('apiSuccess', () => {
    it('should format a successful response correctly', async () => {
      const data = { id: 1, name: 'Test' };
      const response = apiSuccess(data, 201);
      
      expect(response.status).toBe(201);
      
      const json = await response.json();
      expect(json).toEqual(data);
    });

    it('should use 200 as default status code', async () => {
      const response = apiSuccess({ ok: true });
      expect(response.status).toBe(200);
    });
  });

  describe('apiError', () => {
    it('should format an error response correctly', async () => {
      const response = apiError('Not Found', 404);
      
      expect(response.status).toBe(404);
      
      const json = await response.json();
      expect(json).toEqual({
        error: 'Not Found',
      });
    });

    it('should use 500 as default status code', async () => {
      const response = apiError('Server Crash');
      expect(response.status).toBe(500);
    });
  });

  describe('getErrorMessage', () => {
    it('should extract message from Error instance', () => {
      const error = new Error('Custom error message');
      expect(getErrorMessage(error)).toBe('Custom error message');
    });

    it('should return fallback message for string error', () => {
      expect(getErrorMessage('String error')).toBe('An unexpected error occurred');
    });

    it('should return fallback message for unknown objects', () => {
      const obj = { foo: 'bar' };
      expect(getErrorMessage(obj)).toBe('An unexpected error occurred');
    });
  });
});
