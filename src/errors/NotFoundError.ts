import { LyricsLibError } from './LyricsLibError.js';

/**
 * Thrown when a track lookup or search returns no usable result.
 *
 * The default {@link getLyrics} flow returns `null` for "not found" instead of
 * throwing. This class is provided for callers that prefer exception-based
 * control flow on top of the lower-level fetchers.
 */
export class NotFoundError extends LyricsLibError {
  override readonly name = 'NotFoundError';

  constructor(message = 'Track was not found') {
    super(message);
  }
} 