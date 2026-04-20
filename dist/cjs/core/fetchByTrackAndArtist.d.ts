/**
 * Look up lyrics for a track by exact title + artist via `GET /api/get`.
 *
 * Returns:
 * - `plainLyrics` if present, otherwise `syncedLyrics`, otherwise `null`.
 * - `null` when LRCLIB has no record (HTTP 404).
 *
 * Throws {@link RequestError} on transport failure or any non-2xx response
 * other than 404.
 */
export declare function fetchByTrackAndArtist(title: string, artist: string): Promise<string | null>;
//# sourceMappingURL=fetchByTrackAndArtist.d.ts.map