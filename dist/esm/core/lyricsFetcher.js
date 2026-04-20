import { LyricsLibError } from '../errors/LyricsLibError.js';
import { fetchByTitleOnly } from './fetchByTitleOnly.js';
import { fetchByTrackAndArtist } from './fetchByTrackAndArtist.js';
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
export async function getLyrics({ title, artist }) {
    if (!title)
        throw new LyricsLibError('Title is required');
    if (artist) {
        const exact = await fetchByTrackAndArtist(title, artist);
        if (exact)
            return exact;
    }
    return fetchByTitleOnly(title);
}
//# sourceMappingURL=lyricsFetcher.js.map