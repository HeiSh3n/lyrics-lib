import { LRCLIB_API } from '../config/constants.js';
import { RequestError } from '../errors/RequestError.js';
import { fetchWithHeaders } from './fetchWithHeaders.js';
/**
 * Look up lyrics by title only via `GET /api/search`, then fetch the first
 * result by id via `GET /api/get/:id`.
 *
 * Returns:
 * - `plainLyrics` if present, otherwise `syncedLyrics`, otherwise `null`.
 * - `null` when the search returns no results or the first result has no id.
 *
 * Throws {@link RequestError} on transport failure or non-2xx responses
 * (other than 404 on the get-by-id call, which is treated as "no result").
 *
 * Note: this picks the **first** search result with no ranking. Pass an
 * artist to {@link getLyrics} when match precision matters.
 */
export async function fetchByTitleOnly(title) {
    const searchUrl = `${LRCLIB_API}/search?${new URLSearchParams({ track_name: title })}`;
    const searchRes = await fetchWithHeaders(searchUrl, { track: title });
    if (searchRes.status === 404)
        return null;
    if (!searchRes.ok) {
        throw new RequestError(`LRCLIB search returned HTTP ${searchRes.status} for ${searchUrl}`, {
            status: searchRes.status,
            url: searchUrl,
            track: title,
        });
    }
    const results = (await searchRes.json());
    const first = Array.isArray(results) ? results[0] : undefined;
    if (!first || typeof first.id !== 'number')
        return null;
    const getUrl = `${LRCLIB_API}/get/${first.id}`;
    const getRes = await fetchWithHeaders(getUrl, { track: title });
    if (getRes.status === 404)
        return null;
    if (!getRes.ok) {
        throw new RequestError(`LRCLIB returned HTTP ${getRes.status} for ${getUrl}`, {
            status: getRes.status,
            url: getUrl,
            track: title,
        });
    }
    const data = (await getRes.json());
    return data.plainLyrics ?? data.syncedLyrics ?? null;
}
//# sourceMappingURL=fetchByTitleOnly.js.map