import type { LyricsProvider } from './types.js';
/**
 * LRCLIB provider — the real implementation backing {@link getLyrics}.
 *
 * Behavior matches `getLyrics` exactly: tries an exact title + artist
 * lookup first when an artist is provided, then falls back to a
 * title-only search.
 */
export declare const lrclibProvider: LyricsProvider;
//# sourceMappingURL=lrclib.d.ts.map