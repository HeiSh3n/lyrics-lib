/**
 * Optional context attached to {@link RequestError} when a transport failure
 * occurs. Used by the higher-level fetchers to propagate the originating
 * track/artist so callers can correlate the failure.
 */
export interface FetchContext {
    track?: string;
    artist?: string;
}
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
export declare function fetchWithHeaders(url: string, ctx?: FetchContext): Promise<Response>;
//# sourceMappingURL=fetchWithHeaders.d.ts.map