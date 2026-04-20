import type { GetLyricsOptions } from '../types.js';
/**
 * Fetch lyrics for a track from LRCLIB.
 *
 * Strategy:
 * 1. If `artist` is provided, try the exact title + artist lookup first.
 * 2. If that returns no lyrics (or no artist was given), fall back to a
 *    title-only search and use the first result.
 *
 * Returns the lyrics as a string, or `null` if nothing was found.
 *
 * Throws:
 * - {@link LyricsLibError} when `title` is empty.
 * - {@link RequestError} on transport or non-2xx server failure.
 */
export declare function getLyrics({ title, artist }: GetLyricsOptions): Promise<string | null>;
//# sourceMappingURL=lyricsFetcher.d.ts.map