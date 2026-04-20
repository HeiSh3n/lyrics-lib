"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoResultError = void 0;
const LyricsLibError_js_1 = require("./LyricsLibError.js");
/**
 * @deprecated Since v2.0.0. The default {@link getLyrics} flow returns `null`
 * for "no result" instead of throwing, and {@link NotFoundError} covers the
 * exception-based path. Kept in the public surface so existing call sites
 * keep working; no removal is planned.
 */
class NoResultError extends LyricsLibError_js_1.LyricsLibError {
    name = 'NoResultError';
    constructor() {
        super('No result was found');
    }
}
exports.NoResultError = NoResultError;
//# sourceMappingURL=NoResultError.js.map