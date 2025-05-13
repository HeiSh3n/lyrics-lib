/**
 * Error thrown when a network or API request fails.
 */
export class RequestError extends Error {
  /**
   * Create a new RequestError.
   * @param error - Optional error message for additional context.
   */
  constructor(error?: string) {
    super('Request error' + (error ? ' ' + error : ''));
    this.name = 'RequestError';
  }
} 