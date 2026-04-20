import { LyricsLibError } from './LyricsLibError.js';
/**
 * Why a {@link KeyError} was raised.
 *
 * - `missing` — no key was configured at call time (empty env var, empty
 *   `apiKey` option, etc.). Recoverable by supplying a key.
 * - `rejected` — upstream service refused the key (e.g. Genius HTTP
 *   401 / 403). The key is wrong, revoked, or out of quota.
 */
export type KeyErrorReason = 'missing' | 'rejected';
/**
 * Options accepted by the {@link KeyError} constructor.
 */
export interface KeyErrorOptions {
    /** Provider that raised the failure (e.g. `"genius"`). */
    provider?: string;
    /** Why the key failed. See {@link KeyErrorReason}. */
    reason?: KeyErrorReason;
    /** Upstream HTTP status, when `reason` is `"rejected"`. */
    status?: number;
    /** Underlying error, if any. */
    cause?: unknown;
}
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
export declare class KeyError extends LyricsLibError {
    readonly name = "KeyError";
    /** Provider that raised the key failure, when known (e.g. `"genius"`). */
    readonly provider?: string;
    /** Why the key failed. See {@link KeyErrorReason}. */
    readonly reason?: KeyErrorReason;
    /** Upstream HTTP status, when `reason` is `"rejected"`. */
    readonly status?: number;
    constructor(message?: string, options?: KeyErrorOptions);
}
//# sourceMappingURL=KeyError.d.ts.map