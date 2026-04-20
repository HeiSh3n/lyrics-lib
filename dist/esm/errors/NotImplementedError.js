import { LyricsLibError } from './LyricsLibError.js';
/**
 * Thrown when a registered provider has been declared but its implementation
 * is still a placeholder. Carries the provider name so callers can decide
 * whether to fall back to another provider or surface a clear error.
 */
export class NotImplementedError extends LyricsLibError {
    name = 'NotImplementedError';
    provider;
    feature;
    constructor(provider, feature) {
        super(feature
            ? `Provider "${provider}" does not yet implement "${feature}".`
            : `Provider "${provider}" is a placeholder and has no implementation yet.`);
        this.provider = provider;
        if (feature !== undefined)
            this.feature = feature;
    }
}
//# sourceMappingURL=NotImplementedError.js.map