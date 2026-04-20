"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchByTrackAndArtist = fetchByTrackAndArtist;
const constants_js_1 = require("../config/constants.js");
const RequestError_js_1 = require("../errors/RequestError.js");
const fetchWithHeaders_js_1 = require("./fetchWithHeaders.js");
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
async function fetchByTrackAndArtist(title, artist) {
    const params = new URLSearchParams({ track_name: title, artist_name: artist });
    const url = `${constants_js_1.LRCLIB_API}/get?${params.toString()}`;
    const res = await (0, fetchWithHeaders_js_1.fetchWithHeaders)(url, { track: title, artist });
    if (res.status === 404)
        return null;
    if (!res.ok) {
        throw new RequestError_js_1.RequestError(`LRCLIB returned HTTP ${res.status} for ${url}`, {
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