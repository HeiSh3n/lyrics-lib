import type { GetLyricsOptions } from '../types.js';
/**
 * Pluggable lyrics-source contract. A provider is identified by a stable
 * `name` and exposes a single async lookup method that mirrors the public
 * {@link getLyrics} contract: return the lyrics string when found, `null`
 * when nothing matched, and throw a {@link LyricsLibError} subclass for
 * transport or implementation failures.
 *
 * Future implementations (Genius, Musixmatch) will live alongside the
 * existing LRCLIB provider in `src/providers/`. The placeholder providers
 * shipped today throw {@link NotImplementedError} on use so consumers can
 * wire them into a fallback chain ahead of time.
 */
export interface LyricsProvider {
    /** Stable identifier (e.g. `"lrclib"`, `"genius"`, `"musixmatch"`). */
    readonly name: string;
    /** Look up lyrics for the given options. Returns `null` for "no result". */
    fetchLyrics(options: GetLyricsOptions): Promise<string | null>;
}
//# sourceMappingURL=types.d.ts.map