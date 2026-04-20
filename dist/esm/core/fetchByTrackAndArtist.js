import { LRCLIB_API } from '../config/constants.js';
import { RequestError } from '../errors/RequestError.js';
import { fetchWithHeaders } from './fetchWithHeaders.js';
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
export async function fetchByTrackAndArtist(title, artist) {
    const params = new URLSearchParams({ track_name: title, artist_name: artist });
    const url = `${LRCLIB_API}/get?${params.toString()}`;
    const res = await fetchWithHeaders(url, { track: title, artist });
    if (res.status === 404)
        return null;
    if (!res.ok) {
        throw new RequestError(`LRCLIB returned HTTP ${res.status} for ${url}`, {
            status: res.status,
            url,
            track: title,
            artist,
        });
    }
    const data = (await res.json());
    return data.plainLyrics ?? data.syncedLyrics ?? null;
}
//# sourceMappingURL=fetchByTrackAndArtist.js.map