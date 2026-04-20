"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLyrics = getLyrics;
const LyricsLibError_js_1 = require("../errors/LyricsLibError.js");
const fetchByTitleOnly_js_1 = require("./fetchByTitleOnly.js");
const fetchByTrackAndArtist_js_1 = require("./fetchByTrackAndArtist.js");
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
async function getLyrics({ title, artist }) {
    if (!title)
        throw new LyricsLibError_js_1.LyricsLibError('Title is required');
    if (artist) {
        const exact = await (0, fetchByTrackAndArtist_js_1.fetchByTrackAndArtist)(title, artist);
        if (exact)
            return exact;
    }
    return (0, fetchByTitleOnly_js_1.fetchByTitleOnly)(title);
}
//# sourceMappingURL=lyricsFetcher.js.map