import { geniusProvider } from './genius.js';
import { lrclibProvider } from './lrclib.js';
import { musixmatchProvider } from './musixmatch.js';
import type { LyricsProvider } from './types.js';

export type { LyricsProvider } from './types.js';
export { lrclibProvider } from './lrclib.js';
export { geniusProvider } from './genius.js';
export { musixmatchProvider } from './musixmatch.js';

/**
 * Stable identifier for every provider the library knows about. Restricting
 * access to this union prevents typos at the call site — `providers.gneius`
 * will fail to type-check instead of returning `undefined` at runtime.
 */
export type ProviderName = 'lrclib' | 'genius' | 'musixmatch';

/**
 * All providers registered with the library, keyed by their stable name.
 * Use this to look up a provider at runtime, or to iterate the available
 * sources. Note: only `lrclib` is fully implemented today; the others
 * throw {@link NotImplementedError} on use.
 */
export const providers: Readonly<Record<ProviderName, LyricsProvider>> = Object.freeze({
  lrclib: lrclibProvider,
  genius: geniusProvider,
  musixmatch: musixmatchProvider,
});
