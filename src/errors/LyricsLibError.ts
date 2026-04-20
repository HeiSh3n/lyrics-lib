/**
 * Base class for every error thrown by lyrics-lib. Catch this to handle any
 * library-specific failure without also swallowing unrelated errors.
 */
export class LyricsLibError extends Error {
  override readonly name: string = 'LyricsLibError';

  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    if (options?.cause !== undefined) {
      (this as { cause?: unknown }).cause = options.cause;
    }
  }
}
