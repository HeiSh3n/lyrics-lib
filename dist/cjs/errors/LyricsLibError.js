"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyricsLibError = void 0;
/**
 * Base class for every error thrown by lyrics-lib. Catch this to handle any
 * library-specific failure without also swallowing unrelated errors.
 */
class LyricsLibError extends Error {
    name = 'LyricsLibError';
    constructor(message, options) {
        super(message);
        if (options?.cause !== undefined) {
            this.cause = options.cause;
        }
    }
}
exports.LyricsLibError = LyricsLibError;
//# sourceMappingURL=LyricsLibError.js.map