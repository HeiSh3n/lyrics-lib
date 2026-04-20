"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providers = exports.musixmatchProvider = exports.createGeniusProvider = exports.geniusProvider = exports.lrclibProvider = void 0;
const genius_js_1 = require("./genius.js");
const lrclib_js_1 = require("./lrclib.js");
const musixmatch_js_1 = require("./musixmatch.js");
var lrclib_js_2 = require("./lrclib.js");
Object.defineProperty(exports, "lrclibProvider", { enumerable: true, get: function () { return lrclib_js_2.lrclibProvider; } });
var genius_js_2 = require("./genius.js");
Object.defineProperty(exports, "geniusProvider", { enumerable: true, get: function () { return genius_js_2.geniusProvider; } });
Object.defineProperty(exports, "createGeniusProvider", { enumerable: true, get: function () { return genius_js_2.createGeniusProvider; } });
var musixmatch_js_2 = require("./musixmatch.js");
Object.defineProperty(exports, "musixmatchProvider", { enumerable: true, get: function () { return musixmatch_js_2.musixmatchProvider; } });
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
exports.providers = Object.freeze({
    lrclib: lrclib_js_1.lrclibProvider,
    genius: genius_js_1.geniusProvider,
    musixmatch: musixmatch_js_1.musixmatchProvider,
});
//# sourceMappingURL=index.js.map