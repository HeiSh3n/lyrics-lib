"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENIUS_CLIENT_HEADER = exports.GENIUS_API_BASE = exports.LRCLIB_CLIENT_HEADER = exports.LRCLIB_API = exports.LIBRARY_VERSION = void 0;
/**
 * Keep `LIBRARY_VERSION` in lockstep with the `version` field of `package.json`.
 * LRCLIB uses `Lrclib-Client` for rate-limit identity and politeness; the
 * server operators have asked clients to identify themselves with name +
 * version + repo URL.
 */
exports.LIBRARY_VERSION = '2.1.0';
exports.LRCLIB_API = 'https://lrclib.net/api';
exports.LRCLIB_CLIENT_HEADER = `lyrics-lib/${exports.LIBRARY_VERSION} (https://github.com/HeiSh3n/lyrics-lib)`;
/**
 * Base URL for the Genius API. Used by {@link createGeniusProvider} and
 * the default {@link geniusProvider} export. The public search endpoint
 * is `GET ${GENIUS_API_BASE}/search?q=...`; song pages themselves live
 * on `genius.com`, not `api.genius.com`.
 */
exports.GENIUS_API_BASE = 'https://api.genius.com';
/**
 * User-Agent identification string for outbound Genius requests. Keep in
 * lockstep with `LIBRARY_VERSION` so the server operators can identify
 * the caller during abuse investigations.
 */
exports.GENIUS_CLIENT_HEADER = `lyrics-lib/${exports.LIBRARY_VERSION} (https://github.com/HeiSh3n/lyrics-lib)`;
//# sourceMappingURL=constants.js.map