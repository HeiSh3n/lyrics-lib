"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.musixmatchProvider = void 0;
const NotImplementedError_js_1 = require("../errors/NotImplementedError.js");
/**
 * Musixmatch provider — **placeholder**. Throws {@link NotImplementedError}
 * on every call until the real implementation lands.
 *
 * Planned approach (TODO): integrate with the Musixmatch API
 * (`https://api.musixmatch.com/ws/1.1/`). Requires an API key supplied at
 * construction time — the placeholder intentionally accepts no config so
 * the future implementation can introduce a `createMusixmatchProvider({
 * apiKey })` factory without breaking the stub's signature.
 */
exports.musixmatchProvider = {
    name: 'musixmatch',
    async fetchLyrics(_options) {
        throw new NotImplementedError_js_1.NotImplementedError('musixmatch', 'fetchLyrics');
    },
};
//# sourceMappingURL=musixmatch.js.map