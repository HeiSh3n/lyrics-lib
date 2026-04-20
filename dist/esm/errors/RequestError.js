import { LyricsLibError } from './LyricsLibError.js';
/**
 * Thrown when an HTTP request to LRCLIB or Genius fails for transport
 * reasons (network error, DNS failure, non-2xx server response that is
 * not a documented "no result" condition).
 *
 * Structured fields are populated when the throw site has the relevant
 * context. The constructor's first argument is optional for backward
 * compatibility with v1.x callers that wrote `new RequestError()`.
 */
export class RequestError extends LyricsLibError {
    name = 'RequestError';
    status;
    url;
    track;
    artist;
    /**
     * Retry hint in seconds from the upstream `Retry-After` header, when
     * present. Typically set on HTTP 429 responses.
     */
    retryAfter;
    constructor(message = 'Request error', options) {
        super(message, options);
        if (options?.status !== undefined)
            this.status = options.status;
        if (options?.url !== undefined)
            this.url = options.url;
        if (options?.track !== undefined)
            this.track = options.track;
        if (options?.artist !== undefined)
            this.artist = options.artist;
        if (options?.retryAfter !== undefined)
            this.retryAfter = options.retryAfter;
    }
}
//# sourceMappingURL=RequestError.js.map