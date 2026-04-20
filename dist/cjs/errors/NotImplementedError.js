"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotImplementedError = void 0;
const LyricsLibError_js_1 = require("./LyricsLibError.js");
/**
 * Thrown when a registered provider has been declared but its implementation
 * is still a placeholder. Carries the provider name so callers can decide
 * whether to fall back to another provider or surface a clear error.
 */
class NotImplementedError extends LyricsLibError_js_1.LyricsLibError {
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
exports.NotImplementedError = NotImplementedError;
//# sourceMappingURL=NotImplementedError.js.map