import { LyricsLibError } from './LyricsLibError.js';
/**
 * Thrown when a registered provider has been declared but its implementation
 * is still a placeholder. Carries the provider name so callers can decide
 * whether to fall back to another provider or surface a clear error.
 */
export declare class NotImplementedError extends LyricsLibError {
    readonly name = "NotImplementedError";
    readonly provider: string;
    readonly feature?: string;
    constructor(provider: string, feature?: string);
}
//# sourceMappingURL=NotImplementedError.d.ts.map