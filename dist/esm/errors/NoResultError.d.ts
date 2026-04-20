import { LyricsLibError } from './LyricsLibError.js';
/**
 * @deprecated Since v2.0.0. The default {@link getLyrics} flow returns `null`
 * for "no result" instead of throwing, and {@link NotFoundError} covers the
 * exception-based path. Kept in the public surface so existing call sites
 * keep working; no removal is planned.
 */
export declare class NoResultError extends LyricsLibError {
    readonly name = "NoResultError";
    constructor();
}
//# sourceMappingURL=NoResultError.d.ts.map