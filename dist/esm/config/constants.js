/**
 * Keep `LIBRARY_VERSION` in lockstep with the `version` field of `package.json`.
 * LRCLIB uses `Lrclib-Client` for rate-limit identity and politeness; the
 * server operators have asked clients to identify themselves with name +
 * version + repo URL.
 */
export const LIBRARY_VERSION = '2.0.0';
export const LRCLIB_API = 'https://lrclib.net/api';
export const LRCLIB_CLIENT_HEADER = `lyrics-lib/${LIBRARY_VERSION} (https://github.com/HeiSh3n/lyrics-lib)`;
//# sourceMappingURL=constants.js.map