"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyError = void 0;
const LyricsLibError_js_1 = require("./LyricsLibError.js");
/**
 * @deprecated Since v2.0.0. Not thrown by any code path today — the v1.x
 * Genius scraper that used it is gone. Kept in the public surface so
 * existing `instanceof KeyError` call sites keep working; no removal is
 * planned. Future keyed providers (Genius, Musixmatch) may reuse this
 * class for API-key failures when that work lands.
 */
class KeyError extends LyricsLibError_js_1.LyricsLibError {
    name = 'KeyError';
    constructor(_error) {
        super('The key has not been configured.');
    }
}
exports.KeyError = KeyError;
//# sourceMappingURL=KeyError.js.map