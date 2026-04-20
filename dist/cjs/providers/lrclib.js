"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lrclibProvider = void 0;
const fetchByTitleOnly_js_1 = require("../core/fetchByTitleOnly.js");
const fetchByTrackAndArtist_js_1 = require("../core/fetchByTrackAndArtist.js");
/**
 * LRCLIB provider — the real implementation backing {@link getLyrics}.
 *
 * Behavior matches `getLyrics` exactly: tries an exact title + artist
 * lookup first when an artist is provided, then falls back to a
 * title-only search.
 */
exports.lrclibProvider = {
    name: 'lrclib',
    async fetchLyrics({ title, artist }) {
        if (artist) {
            const exact = await (0, fetchByTrackAndArtist_js_1.fetchByTrackAndArtist)(title, artist);
            if (exact)
                return exact;
        }
        return (0, fetchByTitleOnly_js_1.fetchByTitleOnly)(title);
    },
};
//# sourceMappingURL=lrclib.js.map