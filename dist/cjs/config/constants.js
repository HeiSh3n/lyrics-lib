"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LRCLIB_CLIENT_HEADER = exports.LRCLIB_API = exports.LIBRARY_VERSION = void 0;
/**
 * Keep `LIBRARY_VERSION` in lockstep with the `version` field of `package.json`.
 * LRCLIB uses `Lrclib-Client` for rate-limit identity and politeness; the
 * server operators have asked clients to identify themselves with name +
 * version + repo URL.
 */
exports.LIBRARY_VERSION = '2.0.0';
exports.LRCLIB_API = 'https://lrclib.net/api';
exports.LRCLIB_CLIENT_HEADER = `lyrics-lib/${exports.LIBRARY_VERSION} (https://github.com/HeiSh3n/lyrics-lib)`;
//# sourceMappingURL=constants.js.map