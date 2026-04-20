import { geniusProvider } from './genius.js';
import { lrclibProvider } from './lrclib.js';
import { musixmatchProvider } from './musixmatch.js';
export { lrclibProvider } from './lrclib.js';
export { geniusProvider, createGeniusProvider } from './genius.js';
export { musixmatchProvider } from './musixmatch.js';
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
export const providers = Object.freeze({
    lrclib: lrclibProvider,
    genius: geniusProvider,
    musixmatch: musixmatchProvider,
});
//# sourceMappingURL=index.js.map