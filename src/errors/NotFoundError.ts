export class NotFoundError extends Error {
  constructor() {
    super('Track was not found');
    this.name = 'NotFoundError';
  }
} 