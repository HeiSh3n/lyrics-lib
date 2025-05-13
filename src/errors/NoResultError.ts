/**
 * Error thrown when a search or query returns no results.
 */
export class NoResultError extends Error {
  /**
   * Create a new NoResultError.
   */
  constructor() {
    super('No result was found');
    this.name = 'NoResultError';
  }
} 