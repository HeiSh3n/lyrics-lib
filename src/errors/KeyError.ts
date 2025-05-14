export class KeyError extends Error {
  constructor(error?: string) {
    super('The key has not been configured.');
    this.name = 'KeyError';
  }
} 