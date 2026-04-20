/**
 * Base class for every error thrown by lyrics-lib. Catch this to handle any
 * library-specific failure without also swallowing unrelated errors.
 */
export class LyricsLibError extends Error {
    name = 'LyricsLibError';
    constructor(message, options) {
        super(message);
        if (options?.cause !== undefined) {
            this.cause = options.cause;
        }
    }
}
//# sourceMappingURL=LyricsLibError.js.map