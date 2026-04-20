"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithHeaders = fetchWithHeaders;
const constants_js_1 = require("../config/constants.js");
const RequestError_js_1 = require("../errors/RequestError.js");
/**
 * GET `url` with the LRCLIB client identification headers.
 *
 * Throws {@link RequestError} on transport failure (network down, DNS,
 * timeout, abort). HTTP non-2xx responses are returned as-is — callers
 * inspect `res.ok` / `res.status` to distinguish "no result" from real
 * server errors.
 *
 * @deprecated Since v2.0.0. Internal helper — exposed only as a v1.x
 * compatibility shim. Kept available; no removal planned.
 */
async function fetchWithHeaders(url, ctx) {
    try {
        return await fetch(url, {
            headers: {
                'Lrclib-Client': constants_js_1.LRCLIB_CLIENT_HEADER,
                'User-Agent': constants_js_1.LRCLIB_CLIENT_HEADER,
            },
        });
    }
    catch (cause) {
        throw new RequestError_js_1.RequestError(`Network request failed: ${url}`, {
            cause,
            url,
            track: ctx?.track,
            artist: ctx?.artist,
        });
    }
}
//# sourceMappingURL=fetchWithHeaders.js.map