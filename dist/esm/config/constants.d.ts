/**
 * Keep `LIBRARY_VERSION` in lockstep with the `version` field of `package.json`.
 * LRCLIB uses `Lrclib-Client` for rate-limit identity and politeness; the
 * server operators have asked clients to identify themselves with name +
 * version + repo URL.
 */
export declare const LIBRARY_VERSION = "2.1.0";
export declare const LRCLIB_API = "https://lrclib.net/api";
export declare const LRCLIB_CLIENT_HEADER = "lyrics-lib/2.1.0 (https://github.com/HeiSh3n/lyrics-lib)";
/**
 * Base URL for the Genius API. Used by {@link createGeniusProvider} and
 * the default {@link geniusProvider} export. The public search endpoint
 * is `GET ${GENIUS_API_BASE}/search?q=...`; song pages themselves live
 * on `genius.com`, not `api.genius.com`.
 */
export declare const GENIUS_API_BASE = "https://api.genius.com";
/**
 * User-Agent identification string for outbound Genius requests. Keep in
 * lockstep with `LIBRARY_VERSION` so the server operators can identify
 * the caller during abuse investigations.
 */
export declare const GENIUS_CLIENT_HEADER = "lyrics-lib/2.1.0 (https://github.com/HeiSh3n/lyrics-lib)";
//# sourceMappingURL=constants.d.ts.map