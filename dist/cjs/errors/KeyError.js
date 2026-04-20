"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyError = void 0;
const LyricsLibError_js_1 = require("./LyricsLibError.js");
/**
 * Thrown when a provider requires an API key and the key is either not
 * supplied or rejected by the upstream service.
 *
 * Use the `reason` field to distinguish configuration gaps (`"missing"`)
 * from credential failures coming back from the API (`"rejected"`). The
 * `status` field is populated when `reason === "rejected"` and the
 * upstream response carried an HTTP status code.
 *
 * Used by the Genius provider (`createGeniusProvider` /
 * `geniusProvider`) when `apiKey` / `process.env.GENIUS_API_KEY` is
 * missing, and when Genius responds 401/403 to a search call. The
 * class was introduced in v1.x for the original Genius scraper and
 * reactivated in the v2.x Genius reintroduction; `instanceof KeyError`
 * call sites from v1.x keep working.
 */
class KeyError extends LyricsLibError_js_1.LyricsLibError {
    name = 'KeyError';
    /** Provider that raised the key failure, when known (e.g. `"genius"`). */
    provider;
    /** Why the key failed. See {@link KeyErrorReason}. */
    reason;
    /** Upstream HTTP status, when `reason` is `"rejected"`. */
    status;
    constructor(message, options) {
        super(message ?? 'The key has not been configured.', {
            ...(options?.cause !== undefined ? { cause: options.cause } : {}),
        });
        if (options?.provider !== undefined)
            this.provider = options.provider;
        if (options?.reason !== undefined)
            this.reason = options.reason;
        if (options?.status !== undefined)
            this.status = options.status;
    }
}
exports.KeyError = KeyError;
//# sourceMappingURL=KeyError.js.map