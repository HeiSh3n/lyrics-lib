"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const LyricsLibError_js_1 = require("./LyricsLibError.js");
/**
 * Thrown when a track lookup or search returns no usable result.
 *
 * The default {@link getLyrics} flow returns `null` for "not found" instead of
 * throwing. This class is provided for callers that prefer exception-based
 * control flow on top of the lower-level fetchers.
 */
class NotFoundError extends LyricsLibError_js_1.LyricsLibError {
    name = 'NotFoundError';
    constructor(message = 'Track was not found') {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=NotFoundError.js.map