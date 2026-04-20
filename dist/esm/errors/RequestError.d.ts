import { LyricsLibError } from './LyricsLibError.js';
/**
 * Options for {@link RequestError}.
 */
export interface RequestErrorOptions {
    /** Underlying error (network failure, JSON parse failure, etc.). */
    cause?: unknown;
    /** HTTP status code, when the failure was a non-2xx response. */
    status?: number;
    /**
     * Request URL, when known. Callers should redact sensitive query
     * strings before assigning (e.g. Genius `?q=title+artist` leaks
     * user-supplied search terms into logs). The `track` and `artist`
     * fields carry the same data in structured form already.
     */
    url?: string;
    /** Track title from the originating call, when known. */
    track?: string;
    /** Artist name from the originating call, when known. */
    artist?: string;
    /**
     * Retry hint in **seconds**, parsed from an upstream `Retry-After`
     * response header. Populated on HTTP 429 (and occasionally 503)
     * responses when the server advertises a delta-seconds or HTTP-date
     * retry window. `undefined` when absent or unparseable.
     */
    retryAfter?: number;
}
/**
 * Thrown when an HTTP request to LRCLIB or Genius fails for transport
 * reasons (network error, DNS failure, non-2xx server response that is
 * not a documented "no result" condition).
 *
 * Structured fields are populated when the throw site has the relevant
 * context. The constructor's first argument is optional for backward
 * compatibility with v1.x callers that wrote `new RequestError()`.
 */
export declare class RequestError extends LyricsLibError {
    readonly name = "RequestError";
    readonly status?: number;
    readonly url?: string;
    readonly track?: string;
    readonly artist?: string;
    /**
     * Retry hint in seconds from the upstream `Retry-After` header, when
     * present. Typically set on HTTP 429 responses.
     */
    readonly retryAfter?: number;
    constructor(message?: string, options?: RequestErrorOptions);
}
//# sourceMappingURL=RequestError.d.ts.map