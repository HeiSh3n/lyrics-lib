"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geniusProvider = void 0;
const NotImplementedError_js_1 = require("../errors/NotImplementedError.js");
/**
 * Genius provider — **placeholder**. Throws {@link NotImplementedError}
 * on every call until the real implementation lands.
 *
 * Planned approach (TODO): use the official Genius API
 * (`https://api.genius.com/search`) when an API key is provided, with
 * page-scrape fallback. The previous v1.x scraper used `axios` + `cheerio`;
 * the v2.x replacement should reuse the project's native `fetch` helper
 * (see `src/core/fetchWithHeaders.ts`) and keep `cheerio` opt-in.
 */
exports.geniusProvider = {
    name: 'genius',
    async fetchLyrics(_options) {
        throw new NotImplementedError_js_1.NotImplementedError('genius', 'fetchLyrics');
    },
};
//# sourceMappingURL=genius.js.map