/**
 * Error handling type definitions
 * Contains all types related to error state management and error payloads
 */

export interface ErrorState {
  error: string | null;
  hasError: boolean;
  errorType: string | null;
  timestamp: string | null;
}

export interface ErrorPayload {
  message: string;
  type?: 'validation' | 'network' | 'data' | 'general';
}
