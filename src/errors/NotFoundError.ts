/**
 * Error thrown when a requested track or resource is not found.
 */
export class NotFoundError extends Error {
  /**
   * Create a new NotFoundError.
   */
  constructor() {
    super('Track was not found');
    this.name = 'NotFoundError';
  }
} 