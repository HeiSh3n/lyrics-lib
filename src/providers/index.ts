import { geniusProvider } from './genius.js';
import { lrclibProvider } from './lrclib.js';
import { musixmatchProvider } from './musixmatch.js';
import type { LyricsProvider } from './types.js';

export type { LyricsProvider } from './types.js';
export { lrclibProvider } from './lrclib.js';
export { geniusProvider, createGeniusProvider, type GeniusProviderOptions } from './genius.js';
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
 * sources.
 *
 * Current implementation status (2.1.0):
 * - `lrclib` — fully implemented, no API key.
 * - `genius` — fully implemented. Throws {@link KeyError} with
 *   `reason: "missing"` when `process.env.GENIUS_API_KEY` is unset,
 *   or `reason: "rejected"` when Genius rejects the key with 401/403.
 *   Use {@link createGeniusProvider} to supply a key explicitly.
 * - `musixmatch` — placeholder. Throws {@link NotImplementedError}
 *   on every call until the real integration lands.
 */
export const providers: Readonly<Record<ProviderName, LyricsProvider>> = Object.freeze({
  lrclib: lrclibProvider,
  genius: geniusProvider,
  musixmatch: musixmatchProvider,
});
