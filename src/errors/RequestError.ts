import { LyricsLibError } from './LyricsLibError.js';

/**
 * Options for {@link RequestError}.
 */
export interface RequestErrorOptions {
  /** Underlying error (network failure, JSON parse failure, etc.). */
  cause?: unknown;
  /** HTTP status code, when the failure was a non-2xx response. */
  status?: number;
  /** Full request URL, when known. */
  url?: string;
  /** Track title from the originating call, when known. */
  track?: string;
  /** Artist name from the originating call, when known. */
  artist?: string;
}

/**
 * Thrown when an HTTP request to LRCLIB fails for transport reasons (network
 * error, DNS failure, non-2xx server response that is not a documented
 * "no result" condition).
 *
 * Structured fields are populated when the throw site has the relevant
 * context. The constructor's first argument is optional for backward
 * compatibility with v1.x callers that wrote `new RequestError()`.
 */
export class RequestError extends LyricsLibError {
  override readonly name = 'RequestError';
  readonly status?: number;
  readonly url?: string;
  readonly track?: string;
  readonly artist?: string;

  constructor(message: string = 'Request error', options?: RequestErrorOptions) {
    super(message, options);
    if (options?.status !== undefined) this.status = options.status;
    if (options?.url !== undefined) this.url = options.url;
    if (options?.track !== undefined) this.track = options.track;
    if (options?.artist !== undefined) this.artist = options.artist;
  }
} 