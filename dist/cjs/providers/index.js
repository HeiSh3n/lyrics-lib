"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providers = exports.musixmatchProvider = exports.geniusProvider = exports.lrclibProvider = void 0;
const genius_js_1 = require("./genius.js");
const lrclib_js_1 = require("./lrclib.js");
const musixmatch_js_1 = require("./musixmatch.js");
var lrclib_js_2 = require("./lrclib.js");
Object.defineProperty(exports, "lrclibProvider", { enumerable: true, get: function () { return lrclib_js_2.lrclibProvider; } });
var genius_js_2 = require("./genius.js");
Object.defineProperty(exports, "geniusProvider", { enumerable: true, get: function () { return genius_js_2.geniusProvider; } });
var musixmatch_js_2 = require("./musixmatch.js");
Object.defineProperty(exports, "musixmatchProvider", { enumerable: true, get: function () { return musixmatch_js_2.musixmatchProvider; } });
/**
 * All providers registered with the library, keyed by their stable name.
 * Use this to look up a provider at runtime, or to iterate the available
 * sources. Note: only `lrclib` is fully implemented today; the others
 * throw {@link NotImplementedError} on use.
 */
exports.providers = Object.freeze({
    lrclib: lrclib_js_1.lrclibProvider,
    genius: genius_js_1.geniusProvider,
    musixmatch: musixmatch_js_1.musixmatchProvider,
});
//# sourceMappingURL=index.js.map