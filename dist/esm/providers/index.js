import { geniusProvider } from './genius.js';
import { lrclibProvider } from './lrclib.js';
import { musixmatchProvider } from './musixmatch.js';
export { lrclibProvider } from './lrclib.js';
export { geniusProvider } from './genius.js';
export { musixmatchProvider } from './musixmatch.js';
/**
 * All providers registered with the library, keyed by their stable name.
 * Use this to look up a provider at runtime, or to iterate the available
 * sources. Note: only `lrclib` is fully implemented today; the others
 * throw {@link NotImplementedError} on use.
 */
export const providers = Object.freeze({
    lrclib: lrclibProvider,
    genius: geniusProvider,
    musixmatch: musixmatchProvider,
});
//# sourceMappingURL=index.js.map