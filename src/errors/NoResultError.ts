import { LyricsLibError } from './LyricsLibError.js';

/**
 * @deprecated Since v2.0.0. The default {@link getLyrics} flow returns `null`
 * for "no result" instead of throwing, and {@link NotFoundError} covers the
 * exception-based path. Kept in the public surface so existing call sites
 * keep working; no removal is planned.
 */
export class NoResultError extends LyricsLibError {
  override readonly name = 'NoResultError';

  constructor() {
    super('No result was found');
  }
}
