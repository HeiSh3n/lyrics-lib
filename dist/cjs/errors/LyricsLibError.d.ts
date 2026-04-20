/**
 * Base class for every error thrown by lyrics-lib. Catch this to handle any
 * library-specific failure without also swallowing unrelated errors.
 */
export declare class LyricsLibError extends Error {
    readonly name: string;
    constructor(message: string, options?: {
        cause?: unknown;
    });
}
//# sourceMappingURL=LyricsLibError.d.ts.map