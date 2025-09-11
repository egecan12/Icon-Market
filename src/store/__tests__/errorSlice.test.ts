import { describe, it, expect, beforeEach, vi } from 'vitest';
import errorReducer, {
  setError,
  clearError,
  selectError,
  selectHasError,
  selectErrorType,
  selectErrorTimestamp
} from '../errorSlice';
import { ErrorState, ErrorPayload } from '../../types';

describe('Error Slice', () => {
  const initialState: ErrorState = {
    error: null,
    hasError: false,
    errorType: null,
    timestamp: null
  };

  beforeEach(() => {
    // Reset Date mock before each test
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should return the initial state correctly', () => {
      const result = errorReducer(undefined, { type: '@@INIT' });

      expect(result).toEqual({
        error: null,
        hasError: false,
        errorType: null,
        timestamp: null
      });
    });
  });

  describe('setError', () => {
    it('should set error with message and default type', () => {
      const errorPayload: ErrorPayload = {
        message: 'Something went wrong'
      };
      
      const action = setError(errorPayload);
      const result = errorReducer(initialState, action);

      expect(result.error).toBe('Something went wrong');
      expect(result.hasError).toBe(true);
      expect(result.errorType).toBe('general');
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // ISO format
    });

    it('should set error with custom type', () => {
      const errorPayload: ErrorPayload = {
        message: 'Network error occurred',
        type: 'network'
      };
      
      const action = setError(errorPayload);
      const result = errorReducer(initialState, action);

      expect(result.error).toBe('Network error occurred');
      expect(result.hasError).toBe(true);
      expect(result.errorType).toBe('network');
      expect(result.timestamp).toBeDefined();
    });

    it('should set error with validation type', () => {
      const errorPayload: ErrorPayload = {
        message: 'Invalid input data',
        type: 'validation'
      };
      
      const action = setError(errorPayload);
      const result = errorReducer(initialState, action);

      expect(result.error).toBe('Invalid input data');
      expect(result.errorType).toBe('validation');
    });

    it('should set error with data type', () => {
      const errorPayload: ErrorPayload = {
        message: 'Data corruption detected',
        type: 'data'
      };
      
      const action = setError(errorPayload);
      const result = errorReducer(initialState, action);

      expect(result.error).toBe('Data corruption detected');
      expect(result.errorType).toBe('data');
    });

    it('should generate timestamp in ISO format', () => {
      const mockDate = new Date('2023-01-01T12:00:00Z');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const errorPayload: ErrorPayload = {
        message: 'Test error'
      };
      
      const action = setError(errorPayload);
      const result = errorReducer(initialState, action);

      expect(result.timestamp).toBe('2023-01-01T12:00:00.000Z');
    });

    it('should overwrite existing error', () => {
      const existingErrorState: ErrorState = {
        error: 'Old error',
        hasError: true,
        errorType: 'network',
        timestamp: '2023-01-01T10:00:00Z'
      };

      const newErrorPayload: ErrorPayload = {
        message: 'New error',
        type: 'validation'
      };
      
      const action = setError(newErrorPayload);
      const result = errorReducer(existingErrorState, action);

      expect(result.error).toBe('New error');
      expect(result.errorType).toBe('validation');
      expect(result.timestamp).not.toBe('2023-01-01T10:00:00Z');
    });
  });

  describe('clearError', () => {
    it('should clear all error state', () => {
      const errorState: ErrorState = {
        error: 'Some error',
        hasError: true,
        errorType: 'network',
        timestamp: '2023-01-01T12:00:00Z'
      };
      
      const action = clearError();
      const result = errorReducer(errorState, action);

      expect(result).toEqual({
        error: null,
        hasError: false,
        errorType: null,
        timestamp: null
      });
    });

    it('should work when no error exists', () => {
      const action = clearError();
      const result = errorReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('Selectors', () => {
    const mockErrorState: ErrorState = {
      error: 'Test error message',
      hasError: true,
      errorType: 'validation',
      timestamp: '2023-01-01T12:00:00Z'
    };

    it('should select error message', () => {
      const result = selectError({ error: mockErrorState });
      expect(result).toBe('Test error message');
    });

    it('should select hasError flag', () => {
      const result = selectHasError({ error: mockErrorState });
      expect(result).toBe(true);
    });

    it('should select error type', () => {
      const result = selectErrorType({ error: mockErrorState });
      expect(result).toBe('validation');
    });

    it('should select error timestamp', () => {
      const result = selectErrorTimestamp({ error: mockErrorState });
      expect(result).toBe('2023-01-01T12:00:00Z');
    });

    it('should handle null values in selectors', () => {
      const emptyState = { error: initialState };
      
      expect(selectError(emptyState)).toBeNull();
      expect(selectHasError(emptyState)).toBe(false);
      expect(selectErrorType(emptyState)).toBeNull();
      expect(selectErrorTimestamp(emptyState)).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty error message', () => {
      const errorPayload: ErrorPayload = {
        message: ''
      };
      
      const action = setError(errorPayload);
      const result = errorReducer(initialState, action);

      expect(result.error).toBe('');
      expect(result.hasError).toBe(true);
    });

    it('should handle very long error messages', () => {
      const longMessage = 'A'.repeat(1000);
      const errorPayload: ErrorPayload = {
        message: longMessage
      };
      
      const action = setError(errorPayload);
      const result = errorReducer(initialState, action);

      expect(result.error).toBe(longMessage);
      expect(result.hasError).toBe(true);
    });

    it('should handle special characters in error message', () => {
      const specialMessage = 'Error with special chars: áéíóú, 中文, 🚨';
      const errorPayload: ErrorPayload = {
        message: specialMessage
      };
      
      const action = setError(errorPayload);
      const result = errorReducer(initialState, action);

      expect(result.error).toBe(specialMessage);
    });

    it('should handle rapid error state changes', () => {
      let state = initialState;
      
      // Set error
      state = errorReducer(state, setError({ message: 'Error 1', type: 'network' }));
      expect(state.hasError).toBe(true);
      
      // Clear error
      state = errorReducer(state, clearError());
      expect(state.hasError).toBe(false);
      
      // Set different error
      state = errorReducer(state, setError({ message: 'Error 2', type: 'validation' }));
      expect(state.error).toBe('Error 2');
      expect(state.errorType).toBe('validation');
    });
  });

  describe('Error Type Validation', () => {
    const errorTypes = ['validation', 'network', 'data', 'general'] as const;
    
    errorTypes.forEach(type => {
      it(`should handle ${type} error type correctly`, () => {
        const errorPayload: ErrorPayload = {
          message: `${type} error message`,
          type
        };
        
        const action = setError(errorPayload);
        const result = errorReducer(initialState, action);

        expect(result.errorType).toBe(type);
        expect(result.hasError).toBe(true);
      });
    });
  });
});
