/**
 * Error thrown when an API key is required but not configured.
 */
export class KeyError extends Error {
  /**
   * Create a new KeyError.
   * @param error - Optional error message for additional context.
   */
  constructor(error?: string) {
    super('The key has not been configured.');
    this.name = 'KeyError';
  }
} 